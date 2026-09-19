/**
 * ==========================================================================
 * LÓGICA DE LA LANDING DE ESPERA // CEUTA NO SE APAGA
 * ==========================================================================
 */

// Toast global
window.showToast = function(message, duration = 3500) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E1B1B" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('is-show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('is-show');
  }, duration);
};

// Canvas de Partículas y Ascuas Carmesí
class TeaserParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 60;
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
        isCrimson: Math.random() < 0.25
      });
    }

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    this.height = this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.isCrimson) {
        this.ctx.fillStyle = `rgba(158, 27, 27, ${p.alpha * 0.9})`;
        this.ctx.shadowColor = '#9E1B1B';
        this.ctx.shadowBlur = 8;
      } else {
        this.ctx.fillStyle = `rgba(220, 220, 220, ${p.alpha * 0.35})`;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Cuenta atrás hacia el 5 de noviembre a las 20:00 h CEST
class TeaserCountdown {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate).getTime();
    this.daysEl = document.getElementById('count-days');
    this.hoursEl = document.getElementById('count-hours');
    this.minutesEl = document.getElementById('count-minutes');
    this.secondsEl = document.getElementById('count-seconds');
    this.lastValues = {};
  }

  start() {
    this.update();
    setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const diff = this.targetDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.renderDigit(this.daysEl, days, 'days');
    this.renderDigit(this.hoursEl, hours, 'hours');
    this.renderDigit(this.minutesEl, minutes, 'minutes');
    this.renderDigit(this.secondsEl, seconds, 'seconds');
  }

  renderDigit(el, val, key) {
    if (!el) return;
    const formatted = String(val).padStart(2, '0');
    if (this.lastValues[key] !== formatted) {
      el.textContent = formatted;
      this.lastValues[key] = formatted;
    }
  }
}

// Modal de Acceso de Custodia / Desbloqueo de la Web Principal
class CustodyUnlockModal {
  constructor() {
    this.overlay = document.getElementById('passcode-modal-overlay');
    this.openBtns = document.querySelectorAll('.btn-open-unlock');
    this.closeBtn = document.getElementById('btn-close-unlock');
    this.form = document.getElementById('unlock-form');
    this.input = document.getElementById('unlock-passcode-input');
    this.validPasscodes = [
      'LA ORILLA TAMBIÉN RECUERDA',
      'LA ORILLA TAMBIEN RECUERDA',
      '0511',
      'CEUTANOSEAPAGA',
      'V',
      'VENDETTA'
    ];
  }

  init() {
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay?.classList.contains('is-visible')) {
        this.close();
      }

      // Atajo secreto de teclado: Ctrl + Shift + V para abrir directamente la web principal
      if (e.ctrlKey && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        window.location.href = 'landing-completa.html';
      }
    });

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = this.input.value.trim().toUpperCase();
        if (this.validPasscodes.includes(entered)) {
          window.showToast('Acceso autorizado. Cargando señal completa...');
          setTimeout(() => {
            window.location.href = 'landing-completa.html';
          }, 800);
        } else {
          window.showToast('Clave incorrecta. Frecuencia no autorizada.');
          this.input.value = '';
          this.input.focus();
        }
      });
    }
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.input?.focus(), 150);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Partículas
  new TeaserParticles('hero-canvas');

  // 2. Cronómetro
  const countdown = new TeaserCountdown('2026-11-05T20:00:00+02:00');
  countdown.start();

  // 3. Desbloqueo de custodia
  const unlock = new CustodyUnlockModal();
  unlock.init();

  // 4. Sonido ambiental
  if (window.soundscapeEngine) {
    window.soundscapeEngine.init('#btn-soundscape-toggle');
  }

  // 5. Botón Notificarme
  const notifyBtn = document.getElementById('btn-notify-open');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'https://t.me/ceutanoseapaga';
    });
  }
});
