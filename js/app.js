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
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('btn-submit-merchant') || this.form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Transmitiendo solicitud cifrada...</span>';
        }

        const neighborhood = document.getElementById('merchant-neighborhood')?.value || 'No especificada';
        const email = document.getElementById('merchant-email')?.value || 'No especificado';
        const notes = document.getElementById('merchant-notes')?.value || 'Sin notas adicionales';
        const randToken = 'CUSTODIA-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-0511';

        try {
          const response = await fetch('https://formsubmit.co/ajax/ceutanoseapaga@proton.me', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `[SOLICITUD KIT CUSTODIO] ${neighborhood} · ${randToken}`,
              _template: 'table',
              _captcha: 'false',
              'Barriada o Zona': neighborhood,
              'Correo de Contacto': email,
              'Referencia o Comercio': notes,
              'Token de Custodia': randToken,
              'Fecha de Registro': new Date().toLocaleString('es-ES')
            })
          });

          if (this.tokenDisplay) {
            this.tokenDisplay.innerHTML = `
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10B981; padding: 18px; border-radius: 4px; text-align: center; margin-top: 16px;">
                <p style="font-family: var(--font-mono); color: #34D399; font-weight: 700; font-size: 0.95rem; margin-bottom: 6px;">
                  SOLICITUD TRANSMITIDA CON ÉXITO
                </p>
                <p style="font-size: 0.85rem; color: #FFF; margin: 6px 0;">
                  Notificación enviada a la organización (<strong>ceutanoseapaga@proton.me</strong>).
                </p>
                <p style="font-family: var(--font-mono); font-size: 0.8rem; color: #FFB3B3; margin-top: 6px;">
                  Identificador Criptográfico: <strong>${randToken}</strong>
                </p>
                <p style="font-size: 0.76rem; color: #AAA; margin-top: 8px; line-height: 1.5;">
                  Un enlace ciudadano contactará contigo a través de tu correo electrónico (<strong>${email}</strong>) para coordinar el depósito del paquete de máscaras y el microvinilo.
                </p>
              </div>
            `;
          }
          this.form.reset();
          if (submitBtn) {
            submitBtn.style.display = 'none';
          }
          window.showToast('Solicitud enviada a ceutanoseapaga@proton.me');
        } catch (err) {
          // Si falla la red externa o hay bloqueo de adblocker, fallback inmediato
          if (this.tokenDisplay) {
            this.tokenDisplay.innerHTML = `
              <div style="background: rgba(158, 27, 27, 0.15); border: 1px solid var(--accent-crimson); padding: 18px; border-radius: 4px; text-align: center; margin-top: 16px;">
                <p style="font-family: var(--font-mono); color: #FF8F8F; font-weight: 700; font-size: 0.9rem; margin-bottom: 6px;">
                  ENVÍO DIRECTO POR CORREO
                </p>
                <p style="font-size: 0.82rem; color: #CCC; margin-bottom: 12px;">
                  No se pudo conectar con el servicio automático. Pulsa abajo para enviar tu solicitud directamente con tu aplicación de correo:
                </p>
                <a href="mailto:ceutanoseapaga@proton.me?subject=%5BSOLICITUD%20KIT%20CUSTODIO%5D%20${encodeURIComponent(neighborhood)}&body=Barriada:%20${encodeURIComponent(neighborhood)}%0ACorreo:%20${encodeURIComponent(email)}%0ANotas:%20${encodeURIComponent(notes)}%0AToken:%20${randToken}" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.8rem;">
                  Abrir correo a ceutanoseapaga@proton.me
                </a>
              </div>
            `;
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
          window.showToast('Pulsa el botón para enviar por correo directo.');
        }
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
