/**
 * ==========================================================================
 * MOTOR DE PAISAJE SONORO AMBIENTAL (WEB AUDIO API PROCEDURAL)
 * Ceuta No Se Apaga - Generación de sonido en tiempo real:
 * - Olas del Estrecho de Gibraltar (Ruido rosa modulado en bajas frecuencias)
 * - Viento y resonancia costera (Filtro paso-banda barrido lentamente)
 * - Pulso de reloj mecánico solemne (1 Hz / 60 BPM)
 * ==========================================================================
 */

class SoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.clockInterval = null;
    this.btnElement = null;
  }

  init(btnSelector) {
    this.btnElement = document.querySelector(btnSelector);
    if (!this.btnElement) return;

    this.btnElement.addEventListener('click', () => {
      this.toggle();
    });
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  async start() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.audioCtx.currentTime + 3);
      this.masterGain.connect(this.audioCtx.destination);

      // 1. Capa de Olas del Estrecho (Ruido Browniano / Rosa filtrado)
      this.startOceanWaves();

      // 2. Capa de Viento Atmosférico
      this.startWindAtmosphere();

      // 3. Reloj Mecánico Solemne (Tick a cada segundo)
      this.startMechanicalClock();

      this.isPlaying = true;
      if (this.btnElement) {
        this.btnElement.classList.add('is-playing');
        const textNode = this.btnElement.querySelector('.soundscape-label');
        if (textNode) textNode.textContent = 'Silenciar Eco';
      }
    } catch (e) {
      console.warn('AudioContext no inicializado automáticamente:', e);
    }
  }

  stop() {
    if (!this.audioCtx) return;

    if (this.masterGain) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);
      setTimeout(() => {
        if (this.audioCtx && this.audioCtx.state === 'running') {
          this.audioCtx.suspend();
        }
      }, 1200);
    }

    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }

    this.isPlaying = false;
    if (this.btnElement) {
      this.btnElement.classList.remove('is-playing');
      const textNode = this.btnElement.querySelector('.soundscape-label');
      if (textNode) textNode.textContent = 'Paisaje Sonoro';
    }
  }

  startOceanWaves() {
    // Generador de buffer de ruido
    const bufferSize = this.audioCtx.sampleRate * 5;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise aproximado
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filtro pasa bajos para olas
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.audioCtx.currentTime);

    // LFO para emular el flujo y reflujo del mar (ciclos de ~8 segundos)
    const waveGain = this.audioCtx.createGain();
    waveGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.125, this.audioCtx.currentTime); // ~8s periodo
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    whiteNoise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();
  }

  startWindAtmosphere() {
    // Ruido con filtro paso-banda oscilante
    const bufferSize = this.audioCtx.sampleRate * 4;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const windSource = this.audioCtx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const bandpass = this.audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    bandpass.Q.setValueAtTime(3.0, this.audioCtx.currentTime);

    const windGain = this.audioCtx.createGain();
    windGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);

    windSource.connect(bandpass);
    bandpass.connect(windGain);
    windGain.connect(this.masterGain);

    windSource.start();
  }

  startMechanicalClock() {
    // Tick de péndulo cada 1 segundo (60 BPM)
    this.playClockTick();
    this.clockInterval = setInterval(() => {
      if (this.isPlaying && this.audioCtx && this.audioCtx.state === 'running') {
        this.playClockTick();
      }
    }, 1000);
  }

  playClockTick() {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;

    const osc = this.audioCtx.createOscillator();
    const tickGain = this.audioCtx.createGain();

    osc.type = 'sine';
    // Ligera variación entre tic y tac
    const isAlt = Math.floor(Date.now() / 1000) % 2 === 0;
    osc.frequency.setValueAtTime(isAlt ? 1800 : 1550, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);

    tickGain.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.045);

    osc.connect(tickGain);
    tickGain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }
}

window.soundscapeEngine = new SoundscapeEngine();
