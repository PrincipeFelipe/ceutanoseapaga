/**
 * ==========================================================================
 * MODAL REPRODUCTOR AUDIOVISUAL // EMISIÓN DE EMERGENCIA
 * Manifiesto "El Eco de la Ciudad Dormida" con subtítulos nativos sincronizados
 * ==========================================================================
 */

class VideoTransmissionModal {
  constructor() {
    this.overlay = document.getElementById('video-modal-overlay');
    this.openBtns = document.querySelectorAll('.btn-open-video');
    this.closeBtn = document.getElementById('btn-close-video');
    this.subtitlesEl = document.getElementById('video-subtitles-text');
    this.timerEl = document.getElementById('video-timecode');
    this.videoEl = document.getElementById('manifesto-video-element');
    this.toggleSubtitlesBtn = document.getElementById('btn-toggle-subtitles');
    this.toggleSubtitlesLabel = document.getElementById('toggle-subtitles-label');
    this.subtitlesVisible = true;
    
    this.subtitlesSequence = [
      { start: 0, end: 12.8, text: "[SEÑAL CIFRADA ESTABLECIDA // PLAZA DE LOS REYES]" },
      { start: 13, end: 16, text: "Buenas noches, Ceuta." },
      { start: 16, end: 18.5, text: "Sé por qué no dormís bien." },
      { start: 19, end: 23, text: "Hace apenas dos meses que la certeza de vuestras vidas se quebró frente al mar," },
      { start: 23, end: 30.5, text: "cuando fuisteis testigos de cómo esta tierra se veía desbordada ante la mirada atónita de sus propias calles." },
      { start: 31, end: 38.5, text: "Han pasado dos meses desde que aprendimos que los símbolos solo tienen la fuerza que la gente les concede." },
      { start: 39, end: 44, text: "Y hoy, cuando la herida aún está abierta y el eco de lo vivido sigue helando el horizonte," },
      { start: 44, end: 46.5, text: "esa verdad vuelve a llamar a vuestra puerta." },
      { start: 47, end: 50.5, text: "Habéis visto vuestras calles desbordadas," },
      { start: 51, end: 53, text: "vuestra calma fracturada," },
      { start: 53, end: 57.5, text: "y vuestra voz diluida en discursos lejanos que jamás han pisado vuestra tierra." },
      { start: 58, end: 62, text: "Os han pedido silencio a cambio de una falsa normalidad." },
      { start: 62, end: 65.5, text: "Han dicho que la resignación es prudencia." },
      { start: 66, end: 68, text: "Pero el miedo no construye hogares," },
      { start: 68, end: 71.5, text: "solo levanta muros dentro de uno mismo." },
      { start: 72, end: 74, text: "No busco la discordia," },
      { start: 74, end: 76, text: "busco la presencia." },
      { start: 76, end: 79, text: "Porque cuando una comunidad decide no ser invisible," },
      { start: 79, end: 81, text: "no hacen falta gritos." },
      { start: 81, end: 83, text: "Basta con estar de pie," },
      { start: 83, end: 85, text: "hombro con hombro," },
      { start: 85, end: 87, text: "mostrando que esta tierra late," },
      { start: 87, end: 89.5, text: "siente y resiste junta." },
      { start: 90, end: 94, text: "Si todavía creéis que vuestra ciudad merece ser escuchada," },
      { start: 94, end: 100, text: "si entendéis que el destino de vuestro hogar os pertenece a vosotros y no a la inercia del olvido," },
      { start: 100, end: 103.5, text: "os pido que me acompañéis." },
      { start: 104, end: 107, text: "Este 5 de noviembre, a las 8 de la tarde," },
      { start: 107, end: 109, text: "Plaza de los Reyes." },
      { start: 109, end: 111, text: "Traed vuestra máscara." },
      { start: 111, end: 113, text: "No para esconder el rostro," },
      { start: 113, end: 115.5, text: "sino para que todos vean uno solo." },
      { start: 116, end: 119, text: "Recordad:" },
      { start: 119, end: 121, text: "un pueblo despierto" },
      { start: 121, end: 124, text: "nunca camina solo." },
      { start: 123, end: 126.5, text: "(Voz en off) Ceuta no se apaga." }
    ];
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
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('is-visible')) {
        this.close();
      }
    });

    if (this.toggleSubtitlesBtn) {
      this.toggleSubtitlesBtn.addEventListener('click', () => {
        this.subtitlesVisible = !this.subtitlesVisible;
        this.toggleSubtitlesBtn.setAttribute('aria-pressed', String(this.subtitlesVisible));

        if (this.subtitlesVisible) {
          this.toggleSubtitlesBtn.classList.remove('is-hidden-mode');
          if (this.toggleSubtitlesLabel) this.toggleSubtitlesLabel.textContent = 'Ocultar Subtítulos';
          if (this.subtitlesEl) {
            this.subtitlesEl.style.display = 'inline-block';
            this.updateTimeAndSubtitles(this.videoEl ? this.videoEl.currentTime : 0);
          }
        } else {
          this.toggleSubtitlesBtn.classList.add('is-hidden-mode');
          if (this.toggleSubtitlesLabel) this.toggleSubtitlesLabel.textContent = 'Mostrar Subtítulos';
          if (this.subtitlesEl) {
            this.subtitlesEl.style.opacity = '0';
            this.subtitlesEl.style.display = 'none';
          }
        }
      });
    }

    if (this.videoEl) {
      this.videoEl.addEventListener('timeupdate', () => {
        this.updateTimeAndSubtitles(this.videoEl.currentTime);
      });

      this.videoEl.addEventListener('ended', () => {
        if (this.subtitlesEl && this.subtitlesVisible) {
          this.subtitlesEl.textContent = "05.11 · 20:00 H · CEUTA NO SE APAGA.";
          this.subtitlesEl.style.display = 'inline-block';
        }
      });
    }
  }

  open() {
    this.overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    
    // Silenciar temporalmente el paisaje sonoro ambiental si estaba activo
    if (window.soundscapeEngine && window.soundscapeEngine.isPlaying) {
      window.soundscapeEngine.stop();
    }

    if (this.videoEl) {
      this.videoEl.currentTime = 0;
      const playPromise = this.videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Reproducción con sonido silenciado o requerida interacción manual:', err);
        });
      }
    }
  }

  close() {
    this.overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (this.videoEl) {
      this.videoEl.pause();
    }
  }

  updateTimeAndSubtitles(currentSecs) {
    const totalSecs = Math.floor(currentSecs);
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    if (this.timerEl) {
      this.timerEl.textContent = `00:${mins}:${secs}`;
    }

    // Buscar subtítulo activo en el rango exacto de segundos
    const activeSub = this.subtitlesSequence.find(
      sub => currentSecs >= sub.start && currentSecs <= sub.end
    );

    if (this.subtitlesEl) {
      if (this.subtitlesVisible && activeSub) {
        this.subtitlesEl.textContent = activeSub.text;
        this.subtitlesEl.style.display = 'inline-block';
        this.subtitlesEl.style.opacity = '1';
      } else {
        this.subtitlesEl.style.opacity = '0';
        if (!this.subtitlesVisible) {
          this.subtitlesEl.style.display = 'none';
        }
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = new VideoTransmissionModal();
  modal.init();
});
