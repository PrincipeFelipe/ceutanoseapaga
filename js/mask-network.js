/**
 * ==========================================================================
 * RED SILENCIOSA - GESTOR DE PUNTOS DE CUSTODIA DE MÁSCARAS
 * Protección estricta: Coordenadas de cuadrantes de 150m sin revelar comercios
 * ==========================================================================
 */

const CUSTODY_QUADRANTS = [
  {
    id: 'A-04',
    zone: 'centro',
    zoneName: 'Centro / Revellín',
    name: 'Cuadrante A-04: Entorno Plaza de los Reyes / Calle Real',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Comercio tradicional con escaparate acristalado. Esquina inferior derecha.',
    updated: 'Hoy 17:40 h'
  },
  {
    id: 'A-07',
    zone: 'centro',
    zoneName: 'Centro / Revellín',
    name: 'Cuadrante A-07: Paseo del Revellín (Tramo Central)',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Establecimiento de papelería/prensa cívica. Microvinilo rojo visible a pie de acera.',
    updated: 'Hoy 16:15 h'
  },
  {
    id: 'B-12',
    zone: 'centro',
    zoneName: 'Centro / Gran Vía',
    name: 'Cuadrante B-12: Eje Gran Vía / Plaza de África',
    status: 'depleted',
    statusText: 'STOCK AGOTADO · REPOSICIÓN 20:00H',
    remainingApprox: 'Reposición en curso',
    tip: 'Local de reprografía y encuadernación. Próxima entrega de lote a las 20:00 h.',
    updated: 'Hoy 18:05 h'
  },
  {
    id: 'C-08',
    zone: 'hadu',
    zoneName: 'Hadú / Tte. Gautier',
    name: 'Cuadrante C-08: Eje Teniente Gautier / Mercado Central Hadú',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Comercio textil histórico. Vinilo rojo lacre en marco derecho de entrada.',
    updated: 'Hoy 15:30 h'
  },
  {
    id: 'C-11',
    zone: 'hadu',
    zoneName: 'Hadú / Tte. Gautier',
    name: 'Cuadrante C-11: Plaza Víctimas del Terrorismo / Los Rosales',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Tienda de barrio adherida. Pronunciar la clave con calma al dependiente.',
    updated: 'Hoy 17:10 h'
  },
  {
    id: 'D-03',
    zone: 'san-antonio',
    zoneName: 'San Antonio / Hacho',
    name: 'Cuadrante D-03: Subida al Monte Hacho / Ermita San Antonio',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Punto de custodia en cafetería de barrio. Microvinilo en cristalera frontal.',
    updated: 'Hoy 14:20 h'
  },
  {
    id: 'E-02',
    zone: 'benzu',
    zoneName: 'Benzú',
    name: 'Cuadrante E-02: Paseo Marítimo de Benzú / Núcleo Vecinal',
    status: 'available',
    statusText: 'CUSTODIA ACTIVA · DISPONIBLES',
    remainingApprox: 'Disponible',
    tip: 'Comercio de proximidad frente a la costa. Retirada solidaria y anónima.',
    updated: 'Hoy 13:45 h'
  },
  {
    id: 'F-06',
    zone: 'poligono',
    zoneName: 'Polígono / Tarajal',
    name: 'Cuadrante F-06: Eje Comercial Polígono Virgen de África',
    status: 'depleted',
    statusText: 'STOCK AGOTADO · REPOSICIÓN 20:00H',
    remainingApprox: 'Reposición en curso',
    tip: 'Nave de suministros cívicos. Nueva tanda de máscaras selladas en camino.',
    updated: 'Hoy 16:50 h'
  }
];

class MaskNetworkManager {
  constructor() {
    this.currentFilter = 'all';
    this.gridContainer = document.getElementById('quadrant-grid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.copyBtn = document.getElementById('btn-copy-passcode');
    this.passcodeText = document.getElementById('passcode-daily');
  }

  init() {
    if (!this.gridContainer) return;

    this.render();
    this.bindEvents();
  }

  bindEvents() {
    // Filtros de zona
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Copiar clave dinámica del día
    if (this.copyBtn && this.passcodeText) {
      this.copyBtn.addEventListener('click', () => {
        const phrase = this.passcodeText.textContent.trim();
        navigator.clipboard.writeText(phrase).then(() => {
          window.showToast?.(`Clave copiada: "${phrase}". Úsala con cortesía.`);
        }).catch(() => {
          window.showToast?.(`Clave: ${phrase}`);
        });
      });
    }
  }

  render() {
    const filtered = this.currentFilter === 'all'
      ? CUSTODY_QUADRANTS
      : CUSTODY_QUADRANTS.filter(q => q.zone === this.currentFilter);

    if (filtered.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: 8px;">
          <p style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.9rem;">
            No hay puntos de custodia activos actualmente en esta zona específica. Consulta el canal seguro de Telegram para actualizaciones.
          </p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = filtered.map(item => `
      <article class="quadrant-card reveal-on-scroll is-revealed" data-zone="${item.zone}">
        <div class="quadrant-top">
          <span class="quadrant-code">CUADRANTE ${item.id}</span>
          <span class="quadrant-zone">${item.zoneName}</span>
        </div>

        <div>
          <h4 class="quadrant-name">${item.name}</h4>
          <div style="margin-top: 10px;">
            <div class="quadrant-status ${item.status === 'available' ? 'is-available' : 'is-depleted'}">
              <span class="status-led ${item.status === 'available' ? 'green' : 'red'}"></span>
              <span>${item.statusText}</span>
            </div>
          </div>
        </div>

        <div class="quadrant-instructions">
          <p>${item.tip}</p>
          <div class="quadrant-instruction-badge">
            <span class="mini-vinyl-badge" title="Distintivo oficial en escaparate"></span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #BBB;">
              Busca el microvinilo circular rojo lacre (4 cm) en la esquina inferior derecha.
            </span>
          </div>
          <div style="margin-top: 10px; font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);">
            Última verificación de custodia: ${item.updated}
          </div>
        </div>
      </article>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const manager = new MaskNetworkManager();
  manager.init();
});
