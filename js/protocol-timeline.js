/**
 * ==========================================================================
 * PROTOCOLO DEL DÍA D // TIMELINE TÁCTICA INTERACTIVA
 * Sincronización milimétrica para el 5 de noviembre a las 20:00 h
 * ==========================================================================
 */

class ProtocolTimeline {
  constructor() {
    this.steps = document.querySelectorAll('.timeline-step');
  }

  init() {
    if (!this.steps.length) return;

    this.steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        this.selectStep(step);
      });

      // Accesibilidad por teclado
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'button');
      step.setAttribute('aria-label', `Fase táctica ${index + 1}`);

      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectStep(step);
        }
      });
    });

    // Seleccionar por defecto el primer paso
    this.selectStep(this.steps[0]);
  }

  selectStep(targetStep) {
    this.steps.forEach(step => {
      step.classList.remove('is-selected');
      step.setAttribute('aria-selected', 'false');
    });

    targetStep.classList.add('is-selected');
    targetStep.setAttribute('aria-selected', 'true');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const timeline = new ProtocolTimeline();
  timeline.init();
});
