/**
 * ==========================================================================
 * CONTADOR REGRESIVO REACTIVO // CEUTA NO SE APAGA
 * Convocatoria: 05 de Noviembre de 2026 a las 20:00:00 CEST
 * ==========================================================================
 */

class CountdownTimer {
  constructor(targetDate, elements) {
    this.targetDate = new Date(targetDate).getTime();
    this.elements = elements;
    this.timerId = null;
    this.lastValues = { days: null, hours: null, minutes: null, seconds: null };
  }

  start() {
    this.update();
    this.timerId = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      if (this.timerId) clearInterval(this.timerId);
      this.renderCompleted();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.renderDigit(this.elements.days, days, 'days');
    this.renderDigit(this.elements.hours, hours, 'hours');
    this.renderDigit(this.elements.minutes, minutes, 'minutes');
    this.renderDigit(this.elements.seconds, seconds, 'seconds');
  }

  renderDigit(element, value, key) {
    if (!element) return;
    const formatted = String(value).padStart(2, '0');
    if (this.lastValues[key] !== formatted) {
      element.textContent = formatted;
      element.style.transform = 'scale(1.08)';
      element.style.transition = 'transform 0.15s ease';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 150);
      this.lastValues[key] = formatted;
    }
  }

  renderCompleted() {
    const container = document.querySelector('.countdown-grid');
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; background: rgba(158, 27, 27, 0.2); border: 1px solid var(--accent-crimson); border-radius: 6px;">
          <h3 style="font-family: var(--font-display); font-size: 2rem; color: #FFFFFF; letter-spacing: 0.05em; margin-bottom: 6px;">
            LA CONCENTRACIÓN ESTÁ EN CURSO
          </h3>
          <p style="font-family: var(--font-mono); font-size: 0.9rem; color: #FFB3B3;">
            Plaza de los Reyes · Ceuta · 15 Minutos de Silencio Absoluto
          </p>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Fecha objetivo: 5 de noviembre de 2026, 20:00:00 CEST (UTC+2)
  const targetDate = '2026-11-05T20:00:00+02:00';
  
  const timer = new CountdownTimer(targetDate, {
    days: document.getElementById('count-days'),
    hours: document.getElementById('count-hours'),
    minutes: document.getElementById('count-minutes'),
    seconds: document.getElementById('count-seconds')
  });

  timer.start();
});
