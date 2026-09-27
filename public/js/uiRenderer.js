export class UIRenderer {
  static formatPower(watt) {
    const n = Math.abs(watt);
    if (n >= 1000) return `${(n / 1000).toFixed(2)} kW`;
    return `${Math.round(n)} W`;
  }

  static render(model) {
    // 1. Nodes Power & Trạng thái
    this.updateElement('valPV', this.formatPower(model.power.ppv));
    this.updateElement('valBat', this.formatPower(model.power.pbat));
    this.updateElement('valInv', `${(model.power.pac / 1000).toFixed(2)} kW`);
    this.updateElement('valLoad', this.formatPower(model.power.pload));
    this.updateElement('valGrid', this.formatPower(model.power.pgrid));

    // 2. Battery SOC & Trạng thái
    this.updateElement('socVal', `${model.battery.soc}%`);
    this.updateElement('batState', model.battery.isCharging ? 'Đang Sạc' : (model.battery.isDischarging ? 'Đang Xả' : 'Chờ'));
    this.updateElement('chargeEstimate', model.battery.estimateText);
    document.getElementById('socBar').style.width = `${model.battery.soc}%`;

    // 3. Nhiệt độ
    this.updateElement('batTemp', model.battery.batTemp);
    this.updateElement('invTemp', model.system.invTemp);

    // 4. Metrics Cards
    this.updateElement('mCurrent', (model.power.pac / 1000).toFixed(2));
    this.updateElement('mToday', model.energy.eToday);
    this.updateElement('mTotal', model.energy.eTotal);
    this.updateElement('mHours', model.system.operatingTime);

    // 5. Timestamps
    this.updateElement('inverterTime', model.system.lastUpdate);
    this.updateElement('fetchTime', new Date().toLocaleTimeString('vi-VN'));

    // 6. Điều hướng hạt SVG (Active / Reverse)
    this.setFlowState('pulsePV', model.power.ppv > 20, false);
    this.setFlowState('pulseBat', Math.abs(model.power.pbat) > 30, model.battery.isCharging);
    this.setFlowState('pulseLoad', model.power.pload > 20, false);
    this.setFlowState('pulseGrid', Math.abs(model.power.pgrid) > 20, model.power.pgrid < 0);
  }

  static setFlowState(id, isActive, isReverse) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', isActive);
    el.classList.toggle('reverse', isReverse);
  }

  static updateElement(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }
}