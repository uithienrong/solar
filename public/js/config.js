export const SYSTEM_CONFIG = {
  BATTERY: {
    CAPACITY_AH: 294,           // Dung lượng cell thực tế
    NOMINAL_VOLTAGE: 51.2,      // 16S LiFePO4
    MIN_DOD_PERCENT: 20,        // Mức xả sâu tối thiểu bảo vệ pin
  },
  POLLING_INTERVAL_MS: 10000,   // Chu kỳ lấy mẫu 10s
  API_ENDPOINT: '/api/live'
};