/**
 * ==========================================================================
 * LÓGICA DE LA LANDING DE ESPERA ULTRA-MINIMALISTA // CEUTA NO SE APAGA
 * ==========================================================================
 */

// Canvas de Partículas y Ascuas Carmesí Sutiles
class TeaserParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 45;
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
        radius: Math.random() * 2.0 + 0.5,
        alpha: Math.random() * 0.45 + 0.1,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.45 - 0.15,
        isCrimson: Math.random() < 0.3
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
        this.ctx.fillStyle = `rgba(220, 220, 220, ${p.alpha * 0.25})`;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Controlador de acceso reservado mediante atajo de teclado
class SecretAccessHandler {
  constructor() {
    this.init();
  }

  init() {
    // Combinación de teclas: Ctrl + Shift + V (o Meta + Shift + V en Mac)
    document.addEventListener('keydown', (e) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && e.shiftKey && (e.key === 'V' || e.key === 'v' || e.code === 'KeyV')) {
        e.preventDefault();
        window.location.href = 'landing-completa.html';
      }
    });

    // Soporte táctil / secreto adicional (5 toques rápidos en el copyright para móviles)
    let secretClickCount = 0;
    let clickTimeout;
    const trigger = document.getElementById('footer-secret-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        secretClickCount++;
        clearTimeout(clickTimeout);
        if (secretClickCount >= 5) {
          window.location.href = 'landing-completa.html';
        }
        clickTimeout = setTimeout(() => {
          secretClickCount = 0;
        }, 1500);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Partículas sutiles de fondo
  new TeaserParticles('hero-canvas');

  // 2. Manejador del atajo de teclado reservado
  new SecretAccessHandler();

  // 3. Sonido ambiental (Web Audio API)
  if (window.soundscapeEngine) {
    window.soundscapeEngine.init('#btn-soundscape-toggle');
  }
});
