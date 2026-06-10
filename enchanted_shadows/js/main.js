// Enchanted Shadows - Main game loop and state management
const Game = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 480,
    scale: 1,

    // Game states
    STATE: {
        TITLE: 'title',
        NAME_ENTRY: 'nameEntry',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver',
        VICTORY: 'victory',
        LEVEL_INTRO: 'levelIntro',
        LEVEL_TRANSITION: 'levelTransition'
    },
    state: 'title',
    playerName: '',
    currentLevel: 0,
    levelIntroTimer: 0,
    transitionTimer: 0,
    transitionAlpha: 0,

    // Gameplay objects
    player: null,
    enemies: [],
    projectiles: [],
    particles: [],
    puzzleObjects: [],
    pickups: [],
    coins: 0,

    // Timing
    lastTime: 0,
    deltaTime: 0,
    maxDelta: 1 / 30,

    // Screen shake
    shakeTimer: 0,
    shakeMagnitude: 0,

    triggerShake(duration, magnitude) {
        this.shakeTimer = Math.max(this.shakeTimer, duration);
        this.shakeMagnitude = magnitude;
    },

    // Save game (localStorage)
    SAVE_KEY: 'enchantedShadowsSave',
    saveData: null,

    _readSave() {
        try {
            return JSON.parse(localStorage.getItem(this.SAVE_KEY));
        } catch (err) {
            return null;
        }
    },

    _writeSave() {
        this.saveData = {
            name: this.playerName,
            level: this.currentLevel,
            coins: this.coins
        };
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.saveData));
        } catch (err) {
            // Saving is a bonus - never let it break the game
        }
    },

    continueGame() {
        if (!this.saveData) return;
        this.playerName = this.saveData.name || 'Ninja Mage';
        this.coins = this.saveData.coins || 0;
        this.loadLevel(Math.min(this.saveData.level || 0, Levels.data.length - 1));
        this.state = this.STATE.LEVEL_INTRO;
        this.levelIntroTimer = 2.5;
    },

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.saveData = this._readSave();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        Input.init();
        Camera.init(this.width, this.height);
        Audio.init();
        UI.init(this);

        this.state = this.STATE.TITLE;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    resize() {
        // Fit canvas to window while maintaining aspect ratio
        const ratio = this.width / this.height;
        let w = window.innerWidth;
        let h = window.innerHeight;

        if (w / h > ratio) {
            w = h * ratio;
        } else {
            h = w / ratio;
        }

        this.scale = w / this.width;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';

        // Keep pixel art crisp
        this.ctx.imageSmoothingEnabled = false;
    },

    loop(time) {
        this.deltaTime = Math.min((time - this.lastTime) / 1000, this.maxDelta);
        this.lastTime = time;

        Input.update();
        this.update();
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    },

    update() {
        // Music toggle works in every state, so check it before the state switch
        if (Input.musicToggle) {
            Audio.toggleMusic();
        }

        switch (this.state) {
            case this.STATE.TITLE:
                UI.updateTitle(this);
                break;
            case this.STATE.NAME_ENTRY:
                UI.updateNameEntry(this);
                break;
            case this.STATE.PLAYING:
                this.updatePlaying();
                break;
            case this.STATE.PAUSED:
                if (Input.pause) {
                    this.state = this.STATE.PLAYING;
                }
                break;
            case this.STATE.GAME_OVER:
                UI.updateGameOver(this);
                break;
            case this.STATE.VICTORY:
                UI.updateVictory(this);
                break;
            case this.STATE.LEVEL_INTRO:
                this.levelIntroTimer -= this.deltaTime;
                if (this.levelIntroTimer <= 0) {
                    this.state = this.STATE.PLAYING;
                }
                break;
            case this.STATE.LEVEL_TRANSITION:
                this.updateTransition();
                break;
        }
    },

    updatePlaying() {
        if (Input.pause) {
            this.state = this.STATE.PAUSED;
            return;
        }

        // Update puzzle objects first (so moving platforms are in position for physics)
        Puzzles.update(this);

        // Update player
        if (this.player) {
            Player.update(this.player, this);
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            Enemies.update(this.enemies[i], this);
            if (this.enemies[i].dead && this.enemies[i].deathTimer <= 0) {
                this.enemies.splice(i, 1);
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx * this.deltaTime;
            p.y += p.vy * this.deltaTime;
            p.lifetime -= this.deltaTime;

            // Check collision with enemies or player
            if (p.fromPlayer) {
                for (const enemy of this.enemies) {
                    if (!enemy.dead && Physics.overlap(p, enemy)) {
                        Enemies.hit(enemy, p.damage, p.type, this);
                        p.lifetime = 0;
                    }
                }
            } else {
                if (this.player && Physics.overlap(p, this.player)) {
                    Player.hit(this.player, p.damage, this);
                    p.lifetime = 0;
                }
            }

            if (p.lifetime <= 0) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update pickups (hearts and coins)
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const pickup = this.pickups[i];
            pickup.animTimer = (pickup.animTimer || 0) + this.deltaTime;

            // Dropped hearts fall and land on tiles
            if (pickup.gravity) {
                pickup.vy = Math.min((pickup.vy || 0) + 900 * this.deltaTime, 400);
                pickup.y += pickup.vy * this.deltaTime;
                const level = Levels.data[this.currentLevel];
                const below = Physics.getTileAt(level, pickup.x + pickup.width / 2, pickup.y + pickup.height);
                if (pickup.vy > 0 && Physics.isSolid(below)) {
                    pickup.y = Math.floor((pickup.y + pickup.height) / 32) * 32 - pickup.height;
                    pickup.vy = 0;
                }
            }

            if (pickup.lifetime !== undefined) {
                pickup.lifetime -= this.deltaTime;
                if (pickup.lifetime <= 0) {
                    this.pickups.splice(i, 1);
                    continue;
                }
            }

            if (this.player && Physics.overlap(pickup, this.player)) {
                if (pickup.type === 'heart') {
                    // At full health, leave the heart floating for later
                    if (this.player.health < this.player.maxHealth) {
                        this.player.health = Math.min(this.player.maxHealth, this.player.health + 2);
                        Audio.play('heart');
                        this._collectBurst(pickup, ['#FF5566', '#FF99AA', '#FFFFFF']);
                        this.pickups.splice(i, 1);
                    }
                } else if (pickup.type === 'coin') {
                    this.coins++;
                    Audio.play('coin');
                    this._collectBurst(pickup, ['#FFD700', '#FFF4AA', '#FFFFFF']);
                    this.pickups.splice(i, 1);
                }
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx * this.deltaTime;
            pt.y += pt.vy * this.deltaTime;
            pt.lifetime -= this.deltaTime;
            if (pt.gravity) pt.vy += 300 * this.deltaTime;
            if (pt.lifetime <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update camera
        if (this.player) {
            const level = Levels.data[this.currentLevel];
            Camera.follow(
                this.player,
                level.widthPx,
                level.heightPx
            );
        }

        // Check if player fell into a pit
        if (this.player) {
            const level = Levels.data[this.currentLevel];
            if (this.player.y > level.heightPx + 64) {
                this.player.health = 0;
                this.player.alive = false;
                Audio.play('gameover');
            }
        }

        // Check player death
        if (this.player && this.player.health <= 0) {
            this.state = this.STATE.GAME_OVER;
            Audio.setMusic(null);
        }
    },

    transitionLoaded: false,

    updateTransition() {
        this.transitionTimer -= this.deltaTime;
        if (this.transitionTimer > 0.5) {
            this.transitionAlpha = Math.min(1, this.transitionAlpha + this.deltaTime * 3);
        } else if (this.transitionTimer > 0) {
            // Load next level once at midpoint
            if (!this.transitionLoaded) {
                this.transitionLoaded = true;
                this.loadLevel(this.currentLevel);
            }
            this.transitionAlpha = Math.max(0, this.transitionAlpha - this.deltaTime * 3);
        } else {
            this.state = this.STATE.LEVEL_INTRO;
            this.levelIntroTimer = 2;
            this.transitionAlpha = 0;
            this.transitionLoaded = false;
        }
    },

    startGame() {
        this.currentLevel = 0;
        this.coins = 0;
        this.loadLevel(0);
        this.state = this.STATE.LEVEL_INTRO;
        this.levelIntroTimer = 2.5;
        this._writeSave();
    },

    loadLevel(index) {
        this.currentLevel = index;
        const level = Levels.data[index];
        if (!level) {
            this.state = this.STATE.VICTORY;
            Audio.setMusic(null);
            return;
        }
        Audio.setMusic(level.theme);

        this.enemies = Enemies.spawn(level.enemies || []);
        this.projectiles = [];
        this.particles = [];
        this.puzzleObjects = Puzzles.spawn(level.puzzles || []);
        this.pickups = [];
        for (const [col, row] of level.coins || []) {
            this.pickups.push({
                type: 'coin', x: col * 32 + 8, y: row * 32 + 8,
                width: 16, height: 16,
                animTimer: (col % 7) * 0.15   // stagger the bob/spin phases
            });
        }
        for (const [col, row] of level.hearts || []) {
            this.pickups.push({
                type: 'heart', x: col * 32 + 8, y: row * 32 + 8,
                width: 16, height: 16, animTimer: 0
            });
        }
        this.player = Player.create(level.startX, level.startY, this.playerName);

        Camera.x = this.player.x - this.width / 2;
        Camera.y = this.player.y - this.height / 2;
    },

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >= Levels.data.length) {
            this.state = this.STATE.VICTORY;
            Audio.setMusic(null);
        } else {
            this.state = this.STATE.LEVEL_TRANSITION;
            this.transitionTimer = 1.5;
            this.transitionAlpha = 0;
            this._writeSave();
        }
    },

    addProjectile(proj) {
        this.projectiles.push(proj);
    },

    addParticle(p) {
        this.particles.push(p);
    },

    addPickup(pickup) {
        this.pickups.push(pickup);
    },

    _collectBurst(pickup, colors) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            this.addParticle({
                x: pickup.x + pickup.width / 2,
                y: pickup.y + pickup.height / 2,
                vx: Math.cos(angle) * 90,
                vy: Math.sin(angle) * 90,
                size: 3,
                color: colors[i % colors.length],
                lifetime: 0.4,
                maxLifetime: 0.4,
                gravity: false
            });
        }
    },

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        switch (this.state) {
            case this.STATE.TITLE:
                UI.renderTitle(ctx, this);
                break;
            case this.STATE.NAME_ENTRY:
                UI.renderNameEntry(ctx, this);
                break;
            case this.STATE.PLAYING:
            case this.STATE.PAUSED:
            case this.STATE.LEVEL_INTRO:
                this.renderGame(ctx);
                if (this.state === this.STATE.PAUSED) {
                    UI.renderPause(ctx, this);
                }
                if (this.state === this.STATE.LEVEL_INTRO) {
                    UI.renderLevelIntro(ctx, this);
                }
                break;
            case this.STATE.GAME_OVER:
                this.renderGame(ctx);
                UI.renderGameOver(ctx, this);
                break;
            case this.STATE.VICTORY:
                UI.renderVictory(ctx, this);
                break;
            case this.STATE.LEVEL_TRANSITION:
                this.renderGame(ctx);
                ctx.fillStyle = `rgba(0,0,0,${this.transitionAlpha})`;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
        }
    },

    renderGame(ctx) {
        const level = Levels.data[this.currentLevel];
        if (!level) return;

        // Screen shake on hits
        const shaking = this.shakeTimer > 0;
        if (shaking) {
            this.shakeTimer -= this.deltaTime;
            ctx.save();
            ctx.translate(
                Math.round((Math.random() - 0.5) * 2 * this.shakeMagnitude),
                Math.round((Math.random() - 0.5) * 2 * this.shakeMagnitude)
            );
        }

        // Draw background
        Sprites.drawBackground(ctx, level.theme, Camera);

        // Draw tiles
        Levels.render(ctx, level, Camera);

        // Draw tutorial signs
        for (const hint of level.hints || []) {
            Sprites.drawSign(ctx, hint, Camera, this);
        }

        // Draw puzzle objects
        for (const obj of this.puzzleObjects) {
            Puzzles.render(ctx, obj, Camera);
        }

        // Draw pickups
        for (const pickup of this.pickups) {
            if (Camera.isVisible(pickup.x, pickup.y, pickup.width, pickup.height)) {
                Sprites.drawPickup(ctx, pickup, Camera);
            }
        }

        // Draw particles (behind entities)
        for (const pt of this.particles) {
            if (Camera.isVisible(pt.x, pt.y, pt.size, pt.size)) {
                ctx.globalAlpha = Math.max(0, pt.lifetime / pt.maxLifetime);
                ctx.fillStyle = pt.color;
                ctx.fillRect(
                    Math.floor(Camera.screenX(pt.x)),
                    Math.floor(Camera.screenY(pt.y)),
                    pt.size, pt.size
                );
                ctx.globalAlpha = 1;
            }
        }

        // Draw enemies
        for (const enemy of this.enemies) {
            if (Camera.isVisible(enemy.x, enemy.y, enemy.width, enemy.height)) {
                Sprites.drawEnemy(ctx, enemy, Camera);
            }
        }

        // Draw player
        if (this.player) {
            Sprites.drawPlayer(ctx, this.player, Camera);
        }

        // Draw projectiles
        for (const p of this.projectiles) {
            Sprites.drawProjectile(ctx, p, Camera);
        }

        // Draw HUD
        if (this.player) {
            UI.renderHUD(ctx, this);

            // Crystal puzzle message
            if (Puzzles.crystalMessageTimer > 0) {
                const alpha = Math.min(1, Puzzles.crystalMessageTimer);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(this.width / 2 - 160, 60, 320, 36);
                ctx.fillStyle = '#DD88FF';
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(Puzzles.crystalMessage, this.width / 2, 84);
                ctx.textAlign = 'left';
                ctx.globalAlpha = 1;
            }
        }

        if (shaking) {
            ctx.restore();
        }
    }
};

// Start the game when the page loads
window.addEventListener('load', () => Game.init());
