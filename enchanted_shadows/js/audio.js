// Audio system using Web Audio API
const Audio = {
    ctx: null,
    enabled: true,
    masterVolume: 0.3,
    musicOn: true,

    // Step-sequencer state for the looping background music
    music: {
        theme: null,        // 'forest', 'castle', or null (silence)
        step: 0,            // current position in the loop
        nextNoteTime: 0,    // absolute ctx time of the next step to schedule
        timerId: null       // setInterval handle for the scheduler
    },

    init() {
        // Create audio context on first user interaction
        const resume = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            // A theme may have been set before any interaction; the scheduler
            // needs a live context, so kick it off here
            this._startMusicScheduler();
            window.removeEventListener('keydown', resume);
            window.removeEventListener('click', resume);
        };
        window.addEventListener('keydown', resume);
        window.addEventListener('click', resume);
    },

    setMusic(theme) {
        if (theme === this.music.theme) return;
        this.music.theme = theme;
        this.music.step = 0;
        if (this.ctx) {
            // Restart from a clean beat so a theme change never begins mid-phrase
            this.music.nextNoteTime = this.ctx.currentTime + 0.1;
            this._startMusicScheduler();
        }
    },

    toggleMusic() {
        this.musicOn = !this.musicOn;
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
            coin: () => { this._tone(988, 0.08, 'square', 0.12); setTimeout(() => this._tone(1319, 0.18, 'square', 0.12), 70); },
            heart: () => { this._tone(660, 0.12, 'sine', 0.2, 880); setTimeout(() => this._tone(990, 0.22, 'sine', 0.2), 110); },
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
    },

    // Background music loops. Notes are MIDI numbers (null = rest) so the tunes
    // read like sheet music instead of a wall of raw frequencies.
    // Forest: sunny C-major skip up and down the scale - cheerful adventure.
    // Castle: slow A-minor wander - mysterious, but soft waves keep it gentle.
    musicLoops: {
        forest: {
            stepDuration: 0.21,
            melodyWave: 'square',
            bassWave: 'triangle',
            melody: [
                72, null, 76, null, 79, null, 76, null,
                81, 79, null, 76, null, 74, 72, null,
                74, null, 77, null, 79, null, 77, null,
                76, null, 74, null, 72, null, null, null
            ],
            bass: [
                48, null, null, null, 55, null, null, null,
                57, null, null, null, 55, null, null, null,
                53, null, null, null, 55, null, null, null,
                48, null, null, null, 43, null, null, null
            ]
        },
        castle: {
            stepDuration: 0.27,
            melodyWave: 'triangle',
            bassWave: 'triangle',
            melody: [
                69, null, 72, null, 76, null, 74, 72,
                71, null, 67, null, 69, null, null, null,
                69, null, 72, null, 77, null, 76, 74,
                72, null, 71, null, 69, null, null, null
            ],
            bass: [
                45, null, null, null, 45, null, null, null,
                40, null, null, null, 43, null, null, null,
                41, null, null, null, 43, null, null, null,
                45, null, null, null, 40, null, null, null
            ]
        }
    },

    _startMusicScheduler() {
        // Needs a live AudioContext, and only one interval should ever run
        if (!this.ctx || this.music.timerId !== null) return;
        this.music.nextNoteTime = this.ctx.currentTime + 0.1;
        // Schedule ~0.3s ahead every ~100ms: setInterval jitter never reaches
        // the audio clock, so note timing stays glitch-free
        this.music.timerId = setInterval(() => this._scheduleMusic(), 100);
    },

    _scheduleMusic() {
        const loop = this.musicLoops[this.music.theme];
        if (!loop || !this.musicOn || !this.enabled) {
            // Keep the clock current while silent, otherwise re-enabling would
            // burst-schedule every step that "elapsed" in the meantime
            this.music.nextNoteTime = this.ctx.currentTime + 0.1;
            return;
        }
        while (this.music.nextNoteTime < this.ctx.currentTime + 0.3) {
            const stepIndex = this.music.step % loop.melody.length;
            const melodyNote = loop.melody[stepIndex];
            const bassNote = loop.bass[stepIndex];
            // Melody notes end just shy of the next step; bass rings longer to fill the space
            if (melodyNote !== null) {
                this._musicNote(melodyNote, this.music.nextNoteTime, loop.stepDuration * 0.9, loop.melodyWave, 0.06);
            }
            if (bassNote !== null) {
                this._musicNote(bassNote, this.music.nextNoteTime, loop.stepDuration * 3.5, loop.bassWave, 0.07);
            }
            this.music.step++;
            this.music.nextNoteTime += loop.stepDuration;
        }
    },

    _musicNote(midiNote, startTime, duration, waveType, volume) {
        const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume * this.masterVolume, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
};
