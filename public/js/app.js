import { SYSTEM_CONFIG } from './config.js';
import { SolarDataService } from './dataService.js';
import { UIRenderer } from './uiRenderer.js';

class SolarApp {
  constructor() {
    this.countdown = SYSTEM_CONFIG.POLLING_INTERVAL_MS / 1000;
  }

  init() {
    this.startCountdownTimer();
    this.syncData();
    setInterval(() => this.syncData(), SYSTEM_CONFIG.POLLING_INTERVAL_MS);
  }

  startCountdownTimer() {
    const timerEl = document.getElementById('timerSec');
    setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) this.countdown = SYSTEM_CONFIG.POLLING_INTERVAL_MS / 1000;
      if (timerEl) timerEl.innerText = this.countdown;
    }, 1000);
  }

  async syncData() {
    try {
      const data = await SolarDataService.fetchLatestData();
      UIRenderer.render(data);
      this.countdown = SYSTEM_CONFIG.POLLING_INTERVAL_MS / 1000;
    } catch (err) {
      console.error('[SolarApp] Sync failed:', err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new SolarApp();
  app.init();
});