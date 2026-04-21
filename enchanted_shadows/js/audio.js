// Audio system using Web Audio API
const Audio = {
    ctx: null,
    enabled: true,
    masterVolume: 0.3,

    init() {
        // Create audio context on first user interaction
        const resume = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('keydown', resume);
            window.removeEventListener('click', resume);
        };
        window.addEventListener('keydown', resume);
        window.addEventListener('click', resume);
    },

    play(name) {
        if (!this.enabled || !this.ctx) return;
        const sounds = {
            jump: () => this._tone(440, 0.1, 'square', 0.2, 600),
            attack: () => this._noise(0.08, 0.3),
            fireball: () => this._tone(200, 0.3, 'sawtooth', 0.2, 100),
            freeze: () => this._tone(800, 0.4, 'sine', 0.15, 1200),
            dash: () => this._noise(0.15, 0.2),
            nosense: () => this._tone(300, 0.5, 'triangle', 0.2, 500),
            hit: () => this._tone(150, 0.2, 'square', 0.3, 80),
            enemyHit: () => this._tone(200, 0.15, 'square', 0.2, 100),
            enemyDie: () => this._tone(400, 0.3, 'sawtooth', 0.2, 50),
            pickup: () => this._tone(600, 0.15, 'sine', 0.2, 900),
            checkpoint: () => { this._tone(523, 0.15, 'sine', 0.2); setTimeout(() => this._tone(659, 0.15, 'sine', 0.2), 150); setTimeout(() => this._tone(784, 0.2, 'sine', 0.2), 300); },
            portal: () => this._tone(350, 0.5, 'sine', 0.15, 700),
            puzzle: () => { this._tone(440, 0.2, 'triangle', 0.2); setTimeout(() => this._tone(554, 0.2, 'triangle', 0.2), 200); },
            spike: () => this._tone(100, 0.2, 'sawtooth', 0.3, 50),
            victory: () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => this._tone(f, 0.3, 'sine', 0.25), i*200)); },
            gameover: () => { [400,350,300,200].forEach((f,i) => setTimeout(() => this._tone(f, 0.4, 'square', 0.2), i*300)); },
            bosshit: () => this._tone(120, 0.3, 'sawtooth', 0.3, 60),
        };
        if (sounds[name]) sounds[name]();
    },

    _tone(freq, duration, type, volume, endFreq) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (endFreq !== undefined) {
            osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);
        }
        gain.gain.setValueAtTime((volume || 0.2) * this.masterVolume, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    },

    _noise(duration, volume) {
        const ctx = this.ctx;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime((volume || 0.2) * this.masterVolume, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(ctx.currentTime);
    }
};
