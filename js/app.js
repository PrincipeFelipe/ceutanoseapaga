/**
 * ==========================================================================
 * APLICACIÓN PRINCIPAL // CEUTA NO SE APAGA
 * Partículas de niebla en Canvas, Scroll Reveal, Acordeón FAQ y Notificaciones
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

// Canvas de Partículas y Bruma Marina Oscura en el Hero
class HeroParticleFog {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 55;
    this.width = 0;
    this.height = 0;
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Crear partículas
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.45 + 0.1,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.4 - 0.15,
        isCrimson: Math.random() < 0.18 // Algunas partículas con brillo carmesí
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

      // Reaparecer al salir de los límites
      if (p.y < 0) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.isCrimson) {
        this.ctx.fillStyle = `rgba(158, 27, 27, ${p.alpha * 0.85})`;
        this.ctx.shadowColor = '#9E1B1B';
        this.ctx.shadowBlur = 6;
      } else {
        this.ctx.fillStyle = `rgba(220, 220, 220, ${p.alpha * 0.4})`;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

// Acordeón Accesible de Preguntas Frecuentes
class FaqAccordion {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
  }

  init() {
    this.items.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      if (!trigger || !content) return;

      const triggerId = `faq-trigger-${index}`;
      const contentId = `faq-content-${index}`;

      trigger.id = triggerId;
      trigger.setAttribute('aria-controls', contentId);
      trigger.setAttribute('aria-expanded', 'false');
      content.id = contentId;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', triggerId);

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Cerrar los demás acordeones para mantener elegancia editorial
        this.items.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherTrigger = other.querySelector('.faq-trigger');
            const otherContent = other.querySelector('.faq-content');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        }
      });
    });
  }
}

// Modal Formulario de Comerciante Custodio
class MerchantModal {
  constructor() {
    this.overlay = document.getElementById('merchant-modal-overlay');
    this.openBtns = document.querySelectorAll('.btn-open-merchant');
    this.closeBtn = document.getElementById('btn-close-merchant');
    this.form = document.getElementById('merchant-form');
    this.tokenDisplay = document.getElementById('generated-token-box');
  }

  init() {
    if (!this.overlay) return;

    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const randToken = 'CUSTODIA-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-0511';
        if (this.tokenDisplay) {
          this.tokenDisplay.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; padding: 16px; border-radius: 4px; text-align: center; margin-top: 16px;">
              <p style="font-family: var(--font-mono); color: #34D399; font-weight: 700; font-size: 1rem;">
                SOLICITUD ANÓNIMA REGISTRADA
              </p>
              <p style="font-family: var(--font-mono); font-size: 0.8rem; color: #FFF; margin-top: 8px;">
                Token de Custodia Cifrado: <strong style="color: #FFB3B3;">${randToken}</strong>
              </p>
              <p style="font-size: 0.75rem; color: #AAA; margin-top: 6px;">
                Un enlace ciudadano depositará el paquete con las máscaras y el microvinilo antes del 1 de noviembre.
              </p>
            </div>
          `;
        }
        window.showToast('Petición de custodia anónima remitida.');
      });
    }
  }

  open() {
    this.overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
}

// Inicialización de la Web
document.addEventListener('DOMContentLoaded', () => {
  // 1. Partículas Hero
  new HeroParticleFog('hero-canvas');

  // 2. Acordeón FAQ
  new FaqAccordion().init();

  // 3. Modal Comerciantes
  new MerchantModal().init();

  // 4. Inicializar sonido ambiental
  if (window.soundscapeEngine) {
    window.soundscapeEngine.init('#btn-soundscape-toggle');
  }

  // 5. Header Scrolled Class
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // 7. Navegación activa al hacer scroll
  const navSections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    navSections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('is-active');
      }
    });
  }, { passive: true });

  // 8. Menú móvil interactivo
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinksList = document.querySelector('.nav-links');
  if (mobileBtn && navLinksList) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinksList.style.display === 'flex';
      navLinksList.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinksList.style.position = 'absolute';
        navLinksList.style.top = '76px';
        navLinksList.style.left = '0';
        navLinksList.style.width = '100%';
        navLinksList.style.flexDirection = 'column';
        navLinksList.style.backgroundColor = '#0A0A0A';
        navLinksList.style.padding = '24px';
        navLinksList.style.borderBottom = '1px solid #222';
      }
    });
  }
});
