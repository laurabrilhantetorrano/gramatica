// sound.js - Efeitos sonoros sintetizados via Web Audio API (sem dependência de arquivos externos)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("gramatica_sound_muted") === "true";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("gramatica_sound_muted", this.muted ? "true" : "false");
    return this.muted;
  }

  playTone(freq, type = "sine", duration = 0.15, gainVal = 0.15, startDelay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    } catch (e) {
      console.warn("Sound error:", e);
    }
  }

  // Toque suave ao clicar numa palavra
  playClick() {
    this.playTone(480, "triangle", 0.06, 0.08);
  }

  // Desfazer ou remover palavra
  playUndo() {
    this.playTone(320, "sine", 0.08, 0.08);
  }

  // Resposta correta (acorde maior brilhante)
  playSuccess() {
    if (this.muted) return;
    this.playTone(523.25, "sine", 0.25, 0.15, 0);      // C5
    this.playTone(659.25, "sine", 0.25, 0.15, 0.08);   // E5
    this.playTone(783.99, "sine", 0.35, 0.18, 0.16);   // G5
    this.playTone(1046.50, "triangle", 0.45, 0.18, 0.24); // C6
  }

  // Resposta incorreta (som suave de correção pedagógica)
  playError() {
    if (this.muted) return;
    this.playTone(280, "sawtooth", 0.18, 0.06, 0);
    this.playTone(220, "sine", 0.28, 0.08, 0.1);
  }

  // Vitória / Conquista de Medalha
  playFanfare() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880, 880, 1108.73];
    const delays = [0, 0.1, 0.2, 0.3, 0.45, 0.6];
    notes.forEach((n, i) => {
      this.playTone(n, "triangle", 0.35, 0.18, delays[i]);
    });
  }
}

export const sound = new SoundEngine();
