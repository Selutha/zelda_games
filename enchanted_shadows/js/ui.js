// UI system - menus, HUD, dialogs
const UI = {
    nameInput: '',
    nameBlinkTimer: 0,
    titleAnimTimer: 0,
    selectedOption: 0,
    gameOverTimer: 0,
    victoryTimer: 0,

    init(game) {
        // Listen for name entry typing
        window.addEventListener('keydown', (e) => {
            if (game.state !== game.STATE.NAME_ENTRY) return;
            if (e.key === 'Backspace') {
                this.nameInput = this.nameInput.slice(0, -1);
            } else if (e.key === 'Enter' && this.nameInput.length > 0) {
                game.playerName = this.nameInput;
                game.startGame();
            } else if (e.key.length === 1 && this.nameInput.length < 16) {
                // Only allow letters, numbers, spaces
                if (/[a-zA-Z0-9 ]/.test(e.key)) {
                    this.nameInput += e.key;
                }
            }
        });
    },

    // Title screen
    updateTitle(game) {
        this.titleAnimTimer += game.deltaTime;
        if (Input.confirm) {
            game.state = game.STATE.NAME_ENTRY;
            this.nameInput = '';
        }
    },

    renderTitle(ctx, game) {
        // Background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, game.width, game.height);

        // Stars
        for (let i = 0; i < 50; i++) {
            const sx = (i * 137 + 50) % game.width;
            const sy = (i * 97 + 30) % game.height;
            const flicker = Math.sin(this.titleAnimTimer * 2 + i) * 0.3 + 0.7;
            ctx.globalAlpha = flicker;
            ctx.fillStyle = '#FFF';
            ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;

        // Title glow
        const glow = Math.sin(this.titleAnimTimer * 1.5) * 0.2 + 0.8;
        ctx.shadowColor = '#6644CC';
        ctx.shadowBlur = 20 * glow;

        // Title text
        ctx.fillStyle = '#AA88FF';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ENCHANTED', game.width / 2, 160);
        ctx.fillStyle = '#6644AA';
        ctx.font = 'bold 52px monospace';
        ctx.fillText('SHADOWS', game.width / 2, 220);

        ctx.shadowBlur = 0;

        // Subtitle
        ctx.fillStyle = '#8866CC';
        ctx.font = '16px monospace';
        ctx.fillText('Quest for the Golden Spear', game.width / 2, 260);

        // Press start blink
        if (Math.floor(this.titleAnimTimer * 2) % 2 === 0) {
            ctx.fillStyle = '#CCAAFF';
            ctx.font = '18px monospace';
            ctx.fillText('Press ENTER or SPACE to Start', game.width / 2, 360);
        }

        // Controls hint
        ctx.fillStyle = '#555';
        ctx.font = '12px monospace';
        ctx.fillText('Arrow Keys / WASD = Move & Jump  |  J/Z = Attack  |  1-4 = Spells', game.width / 2, 440);
        ctx.textAlign = 'left';
    },

    // Name entry
    updateNameEntry(game) {
        this.nameBlinkTimer += game.deltaTime;
    },

    renderNameEntry(ctx, game) {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, game.width, game.height);

        ctx.fillStyle = '#AA88FF';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Name Your Ninja Mage', game.width / 2, 140);

        // Name box
        ctx.strokeStyle = '#6644AA';
        ctx.lineWidth = 2;
        ctx.strokeRect(game.width / 2 - 150, 190, 300, 50);

        // Name text
        ctx.fillStyle = '#FFF';
        ctx.font = '24px monospace';
        let displayName = this.nameInput;
        if (Math.floor(this.nameBlinkTimer * 3) % 2 === 0) {
            displayName += '_';
        }
        ctx.fillText(displayName, game.width / 2, 222);

        // Draw a preview of the ninja mage
        const previewX = game.width / 2 - 10;
        const previewY = 290;
        // Simple large preview of character
        ctx.fillStyle = '#4477CC';
        ctx.fillRect(previewX - 15, previewY, 30, 45);
        ctx.fillStyle = '#AABBCC';
        ctx.fillRect(previewX - 15, previewY, 30, 8);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(previewX - 8, previewY + 10, 16, 8);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(previewX - 5, previewY + 13, 3, 3);
        ctx.fillRect(previewX + 3, previewY + 13, 3, 3);

        // Instruction
        ctx.fillStyle = '#888';
        ctx.font = '14px monospace';
        ctx.fillText('Type your name and press ENTER', game.width / 2, 380);

        ctx.textAlign = 'left';
    },

    // HUD
    renderHUD(ctx, game) {
        const player = game.player;
        const padding = 10;

        // Hearts
        const hearts = Math.ceil(player.maxHealth / 2);
        for (let i = 0; i < hearts; i++) {
            const hx = padding + i * 22;
            const hp = (i + 1) * 2;
            if (player.health >= hp) {
                this._drawHeart(ctx, hx, padding, '#FF3344', true);
            } else if (player.health >= hp - 1) {
                this._drawHeart(ctx, hx, padding, '#FF3344', false);
            } else {
                this._drawHeart(ctx, hx, padding, '#333', true);
            }
        }

        // Mana bar
        const manaBarWidth = 100;
        ctx.fillStyle = '#222';
        ctx.fillRect(padding, padding + 22, manaBarWidth + 2, 10);
        ctx.fillStyle = '#3355DD';
        ctx.fillRect(padding + 1, padding + 23, (player.mana / player.maxMana) * manaBarWidth, 8);

        // Key count
        if (player.keys > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px monospace';
            // Key icon
            ctx.fillRect(padding, padding + 38, 2, 8);
            ctx.fillRect(padding - 1, padding + 36, 4, 4);
            ctx.fillRect(padding + 2, padding + 42, 3, 2);
            ctx.fillText('x' + player.keys, padding + 8, padding + 46);
        }

        // Player name
        ctx.fillStyle = '#FFF';
        ctx.font = '10px monospace';
        ctx.fillText(player.name, padding, padding + 58);

        // Spell indicators
        const spellNames = ['Fire', 'Ice', 'Dash', 'Blind'];
        const spellCosts = [20, 25, 15, 30];
        const spellColors = ['#FF6622', '#44BBFF', '#8844CC', '#FFAA00'];
        for (let i = 0; i < 4; i++) {
            const sx = game.width - 220 + i * 55;
            const canCast = player.mana >= spellCosts[i];
            ctx.fillStyle = canCast ? spellColors[i] : '#333';
            ctx.fillRect(sx, padding, 48, 20);
            ctx.fillStyle = canCast ? '#FFF' : '#666';
            ctx.font = '9px monospace';
            ctx.fillText(`${i + 1}:${spellNames[i]}`, sx + 3, padding + 13);
        }

        // Level name
        const level = Levels.data[game.currentLevel];
        if (level) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(level.name, game.width - padding, game.height - padding);
            ctx.textAlign = 'left';
        }

        // Boss health bar
        const boss = game.enemies.find(e => e.type === 'shadowKing');
        if (boss && !boss.dead) {
            const bw = 200;
            const bx = game.width / 2 - bw / 2;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(bx - 2, game.height - 30, bw + 4, 16);
            ctx.fillStyle = '#880044';
            ctx.fillRect(bx, game.height - 28, (boss.health / boss.maxHealth) * bw, 12);
            ctx.fillStyle = '#FFF';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('SHADOW KING', game.width / 2, game.height - 19);
            ctx.textAlign = 'left';
        }
    },

    _drawHeart(ctx, x, y, color, full) {
        ctx.fillStyle = color;
        if (full) {
            // Full heart
            ctx.fillRect(x + 2, y, 4, 2);
            ctx.fillRect(x + 10, y, 4, 2);
            ctx.fillRect(x, y + 2, 16, 4);
            ctx.fillRect(x + 2, y + 6, 12, 4);
            ctx.fillRect(x + 4, y + 10, 8, 3);
            ctx.fillRect(x + 6, y + 13, 4, 2);
        } else {
            // Half heart - draw left half only
            ctx.fillRect(x + 2, y, 4, 2);
            ctx.fillRect(x, y + 2, 8, 4);
            ctx.fillRect(x + 2, y + 6, 6, 4);
            ctx.fillRect(x + 4, y + 10, 4, 3);
            ctx.fillRect(x + 6, y + 13, 2, 2);
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 10, y, 4, 2);
            ctx.fillRect(x + 8, y + 2, 8, 4);
            ctx.fillRect(x + 8, y + 6, 6, 4);
            ctx.fillRect(x + 8, y + 10, 4, 3);
            ctx.fillRect(x + 8, y + 13, 2, 2);
        }
    },

    // Pause screen
    renderPause(ctx, game) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, game.width, game.height);

        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', game.width / 2, game.height / 2 - 20);

        ctx.fillStyle = '#AAA';
        ctx.font = '16px monospace';
        ctx.fillText('Press ESC or P to resume', game.width / 2, game.height / 2 + 20);
        ctx.textAlign = 'left';
    },

    // Level intro
    renderLevelIntro(ctx, game) {
        const level = Levels.data[game.currentLevel];
        if (!level) return;

        const alpha = Math.min(1, game.levelIntroTimer);
        ctx.fillStyle = `rgba(0,0,0,${alpha * 0.7})`;
        ctx.fillRect(0, 0, game.width, game.height);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#AA88FF';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(level.name, game.width / 2, game.height / 2 - 10);

        ctx.fillStyle = '#888';
        ctx.font = '14px monospace';
        const themeText = level.theme === 'forest' ? 'The Enchanted Forest' : 'The Shadow Castle';
        ctx.fillText(themeText, game.width / 2, game.height / 2 + 20);
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
    },

    // Game over
    updateGameOver(game) {
        this.gameOverTimer += game.deltaTime;
        if (this.gameOverTimer > 2 && Input.confirm) {
            this.gameOverTimer = 0;
            game.loadLevel(game.currentLevel);
            game.state = game.STATE.PLAYING;
        }
    },

    renderGameOver(ctx, game) {
        ctx.fillStyle = 'rgba(100,0,0,0.7)';
        ctx.fillRect(0, 0, game.width, game.height);

        ctx.fillStyle = '#FF2222';
        ctx.font = 'bold 40px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', game.width / 2, game.height / 2 - 20);

        if (this.gameOverTimer > 2) {
            ctx.fillStyle = '#FFF';
            ctx.font = '16px monospace';
            ctx.fillText('Press ENTER to try again', game.width / 2, game.height / 2 + 30);
        }
        ctx.textAlign = 'left';
    },

    // Victory
    updateVictory(game) {
        this.victoryTimer += game.deltaTime;
    },

    renderVictory(ctx, game) {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, game.width, game.height);

        // Sparkles
        for (let i = 0; i < 30; i++) {
            const sx = (i * 137 + Math.sin(this.victoryTimer + i) * 50) % game.width;
            const sy = (i * 97 + Math.cos(this.victoryTimer * 0.7 + i) * 30) % game.height;
            ctx.fillStyle = `hsl(${(this.victoryTimer * 50 + i * 30) % 360}, 80%, 70%)`;
            ctx.fillRect(sx, sy, 3, 3);
        }

        // Golden spear
        const spearY = 120 + Math.sin(this.victoryTimer * 2) * 10;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(game.width / 2 - 3, spearY, 6, 80);
        ctx.beginPath();
        ctx.moveTo(game.width / 2, spearY - 20);
        ctx.lineTo(game.width / 2 - 10, spearY + 10);
        ctx.lineTo(game.width / 2 + 10, spearY + 10);
        ctx.fillStyle = '#FFD700';
        ctx.fill();

        // Glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(game.width / 2 - 1, spearY, 2, 1);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', game.width / 2, 260);

        ctx.fillStyle = '#FFF';
        ctx.font = '20px monospace';
        ctx.fillText(`${game.playerName} claimed the Golden Spear!`, game.width / 2, 300);

        ctx.fillStyle = '#AA88FF';
        ctx.font = '16px monospace';
        ctx.fillText('The Shadow King is defeated!', game.width / 2, 340);
        ctx.fillText('Peace returns to the enchanted lands.', game.width / 2, 365);

        ctx.fillStyle = '#888';
        ctx.font = '14px monospace';
        ctx.fillText('Thank you for playing Enchanted Shadows!', game.width / 2, 420);
        ctx.textAlign = 'left';
    }
};
