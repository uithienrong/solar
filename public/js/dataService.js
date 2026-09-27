import { SYSTEM_CONFIG } from './config.js';

export class SolarDataService {
  static async fetchLatestData() {
    const res = await fetch(SYSTEM_CONFIG.API_ENDPOINT);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const raw = await res.json();
    return this.transform(raw);
  }

  static transform(raw) {
    const flow = raw.flow || {};
    const summary = (raw.summary?.data && typeof raw.summary.data === 'object') ? raw.summary.data : (raw.summary || {});
    const detail = raw.detail || {};

    // 1. Công suất tức thời (W)
    const ppv = parseFloat(flow.TotalDCpower ?? flow.ppv ?? detail.TotalDCpower ?? 0);
    const pbat = parseFloat(flow.Pbat ?? flow.p_bat ?? 0);
    const pgrid = parseFloat(flow.gridCurrpac ?? flow.Pgrid ?? 0);
    const soc = parseInt(flow.SOC ?? flow.soc ?? detail.SOC ?? 0);

    // Tính tải nhà (Home Load)
    let pload = parseFloat(flow.loadCurrpac ?? flow.Pload ?? flow.pload ?? 0);
    if (pload === 0 && ppv > 0) {
      const calculated = ppv - Math.abs(pbat) + (pgrid > 0 ? pgrid : 0);
      pload = Math.max(0, calculated);
    }

    // Inverter AC Output
    let pac = parseFloat(summary.Pac ?? summary.pac ?? detail.CurrPac ?? flow.Pac ?? 0);
    if (pac === 0 && pload > 0) pac = pload;

    // 2. Sản lượng tích lũy (kWh)
    const eToday = this.parseKwh(detail.EToday ?? summary.e_today ?? summary.EToday);
    const eTotal = this.parseKwh(detail.ETotal ?? summary.e_total ?? summary.ETotal);

    // 3. Thời gian vận hành
    const totalHours = parseFloat(detail.Htotal ?? summary.h_total ?? 2290);

    // 4. Nhiệt độ
    const batTemp = parseFloat(flow.BMS_temp ?? detail.BatTemp ?? 31);
    const invTemp = parseFloat(detail.Temperature ?? summary.Temperature ?? 39);

    // 5. Dự báo pin dựa trên pack 294Ah
    const batVolt = parseFloat(flow.volt ?? flow.volt2 ?? SYSTEM_CONFIG.BATTERY.NOMINAL_VOLTAGE);
    const totalBatteryKwh = (batVolt * SYSTEM_CONFIG.BATTERY.CAPACITY_AH) / 1000;
    const batteryEstimate = this.calculateBatteryTime(pbat, soc, totalBatteryKwh);

    return {
      power: { ppv, pbat, pgrid, pload, pac },
      energy: { eToday, eTotal },
      battery: {
        soc,
        batTemp,
        isCharging: pbat < -30,
        isDischarging: pbat > 30,
        estimateText: batteryEstimate
      },
      system: {
        invTemp,
        operatingTime: this.formatOperatingTime(totalHours),
        lastUpdate: detail.DataTime ?? raw.serverTime ?? new Date().toLocaleTimeString('vi-VN')
      }
    };
  }

  static parseKwh(val) {
    if (!val) return '0.00';
    const n = parseFloat(val);
    if (isNaN(n)) return '0.00';
    return (n > 500 ? (n / 1000) : n).toFixed(2);
  }

  static formatOperatingTime(hours) {
    const d = Math.floor(hours / 24);
    const h = Math.round(hours % 24);
    const y = Math.floor(d / 365);
    const m = Math.floor((d % 365) / 30);
    const remDays = (d % 365) % 30;

    const parts = [];
    if (y > 0) parts.push(`${y} năm`);
    if (m > 0) parts.push(`${m} tháng`);
    if (remDays > 0) parts.push(`${remDays} ngày`);
    parts.push(`${h} giờ`);
    return parts.join(' ');
  }

  static calculateBatteryTime(pbat, soc, totalKwh) {
    const absWatt = Math.abs(pbat);
    if (absWatt < 50) return 'Pin đang ở trạng thái chờ';

    if (pbat < -30 && soc < 100) {
      const remainKwh = totalKwh * ((100 - soc) / 100);
      const mins = Math.round((remainKwh / (absWatt / 1000)) * 60);
      const targetTime = new Date(Date.now() + mins * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `Đầy sau: ~${Math.floor(mins / 60)}h ${mins % 60}p (${targetTime})`;
    }

    if (pbat > 30 && soc > SYSTEM_CONFIG.BATTERY.MIN_DOD_PERCENT) {
      const usableKwh = totalKwh * ((soc - SYSTEM_CONFIG.BATTERY.MIN_DOD_PERCENT) / 100);
      const mins = Math.round((usableKwh / (absWatt / 1000)) * 60);
      return `Khả dụng: ~${Math.floor(mins / 60)}h ${mins % 60}p (đến ngưỡng 20%)`;
    }

    return soc >= 100 ? 'Pin đã sạc đầy (100%)' : 'Pin đạt ngưỡng xả an toàn';
  }
}