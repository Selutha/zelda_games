// Puzzle mechanics for Enchanted Shadows
const Puzzles = {
    spawn(puzzleData) {
        return puzzleData.map(data => {
            const obj = { ...data, active: false, triggered: false, animTimer: 0 };
            return obj;
        });
    },

    update(game) {
        // Tick down crystal message timer
        if (this.crystalMessageTimer > 0) {
            this.crystalMessageTimer -= game.deltaTime;
        }

        for (const obj of game.puzzleObjects) {
            obj.animTimer += game.deltaTime;

            switch (obj.type) {
                case 'pressurePlate':
                    this._updatePressurePlate(obj, game);
                    break;
                case 'crystal':
                    this._updateCrystal(obj, game);
                    break;
                case 'movingPlatform':
                    this._updateMovingPlatform(obj, game);
                    break;
                case 'pushBlock':
                    this._updatePushBlock(obj, game);
                    break;
                case 'door':
                    this._updateDoor(obj, game);
                    break;
                case 'key':
                    this._updateKey(obj, game);
                    break;
                case 'lockedDoor':
                    this._updateLockedDoor(obj, game);
                    break;
                case 'springBoard':
                    this._updateSpringBoard(obj, game);
                    break;
            }
        }
    },

    _updatePressurePlate(obj, game) {
        const player = game.player;
        if (!player) return;
        const wasActive = obj.active;
        obj.active = Physics.overlap(player, { x: obj.x, y: obj.y, width: 32, height: 8 });
        if (obj.active && !wasActive) {
            Audio.play('puzzle');
            // Activate linked objects
            for (const linked of game.puzzleObjects) {
                if (linked.linkedId === obj.id) {
                    linked.triggered = true;
                }
            }
        }
    },

    // Crystal message display
    crystalMessage: '',
    crystalMessageTimer: 0,

    _updateCrystal(obj, game) {
        const player = game.player;
        if (!player || obj.triggered) return;
        if (Physics.overlap(player, { x: obj.x, y: obj.y, width: 32, height: 32 })) {
            obj.triggered = true;
            Audio.play('pickup');

            // Sparkle particles
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 / 10) * i;
                game.addParticle({
                    x: obj.x + 16,
                    y: obj.y + 16,
                    vx: Math.cos(angle) * 100,
                    vy: Math.sin(angle) * 100,
                    size: 3,
                    color: ['#AA44FF', '#DD88FF', '#FFFFFF'][Math.floor(Math.random() * 3)],
                    lifetime: 0.5,
                    maxLifetime: 0.5,
                    gravity: false
                });
            }

            // Check progress
            const crystals = game.puzzleObjects.filter(p => p.type === 'crystal' && p.group === obj.group);
            const collected = crystals.filter(c => c.triggered).length;
            const total = crystals.length;

            if (collected >= total) {
                // All collected - open linked door
                this.crystalMessage = 'All crystals found! A door opens...';
                this.crystalMessageTimer = 3;
                Audio.play('checkpoint');
                for (const linked of game.puzzleObjects) {
                    if (linked.linkedId === obj.group) {
                        linked.triggered = true;
                    }
                }
            } else {
                this.crystalMessage = `Crystal ${collected} of ${total} found!`;
                this.crystalMessageTimer = 2;
            }
        }
    },

    _updateMovingPlatform(obj, game) {
        if (!obj.triggered && obj.requiresTrigger) return;
        const speed = obj.speed || 60;
        obj.progress = (obj.progress || 0) + game.deltaTime * speed;
        const t = (Math.sin(obj.progress * 0.02) + 1) / 2;
        const oldX = obj.x;
        const oldY = obj.y;
        obj.x = obj.startX + (obj.endX - obj.startX) * t;
        obj.y = obj.startY + (obj.endY - obj.startY) * t;

        const platW = obj.width || 64;
        const platH = 8;
        const player = game.player;
        if (!player) return;

        // Check if player is falling onto or standing on this platform
        const playerBottom = player.y + player.height;
        const isAbove = player.x + player.width > obj.x && player.x < obj.x + platW;

        if (isAbove && player.vy >= 0) {
            // Player's feet are near platform top
            const prevBottom = playerBottom - player.vy * game.deltaTime;
            if (prevBottom <= obj.y + 4 && playerBottom >= obj.y) {
                player.y = obj.y - player.height;
                player.vy = 0;
                player.onGround = true;
                // Carry player with platform movement
                player.x += (obj.x - oldX);
                player.y += (obj.y - oldY);
            }
        }

        // Also keep carrying the player if already standing on it
        if (player.onGround) {
            const onPlat = player.x + player.width > obj.x && player.x < obj.x + platW &&
                           Math.abs((player.y + player.height) - obj.y) < 4;
            if (onPlat) {
                player.y = obj.y - player.height;
                player.onGround = true;
                player.x += (obj.x - oldX);
                player.y += (obj.y - oldY);
            }
        }
    },

    _updatePushBlock(obj, game) {
        const player = game.player;
        if (!player) return;
        const blockRect = { x: obj.x, y: obj.y, width: 32, height: 32 };
        if (Physics.overlap(player, blockRect)) {
            if (player.x < obj.x && Input.right) {
                obj.x += 60 * game.deltaTime;
            } else if (player.x > obj.x && Input.left) {
                obj.x -= 60 * game.deltaTime;
            }
        }
        // Apply gravity to push block
        const level = Levels.data[game.currentLevel];
        const belowTile = Physics.getTileAt(level, obj.x + 16, obj.y + 33);
        if (!Physics.isSolid(belowTile)) {
            obj.y += 200 * game.deltaTime;
        }
    },

    _updateSpringBoard(obj, game) {
        const player = game.player;
        if (!player) return;
        if (obj._cooldown > 0) { obj._cooldown -= game.deltaTime; return; }
        const padRect = { x: obj.x, y: obj.y, width: obj.width || 32, height: 12 };
        if (Physics.overlap(player, padRect) && player.vy >= 0) {
            // Launch player upward
            player.vy = obj.power || -750;
            player.onGround = false;
            obj._cooldown = 0.3;
            obj._bounceAnim = 0.3;
            Audio.play('jump');
            // Bounce particles
            for (let i = 0; i < 6; i++) {
                game.addParticle({
                    x: obj.x + (obj.width || 32) / 2,
                    y: obj.y,
                    vx: (Math.random() - 0.5) * 100,
                    vy: -Math.random() * 150,
                    size: 3,
                    color: ['#44FF44', '#88FF88', '#FFFF44'][Math.floor(Math.random() * 3)],
                    lifetime: 0.4,
                    maxLifetime: 0.4,
                    gravity: true
                });
            }
        }
        if (obj._bounceAnim > 0) obj._bounceAnim -= game.deltaTime;
    },

    _updateKey(obj, game) {
        const player = game.player;
        if (!player || obj.triggered) return;
        if (Physics.overlap(player, { x: obj.x, y: obj.y, width: 24, height: 24 })) {
            obj.triggered = true;
            player.keys = (player.keys || 0) + 1;
            Audio.play('pickup');

            this.crystalMessage = `Key found! (${player.keys} key${player.keys > 1 ? 's' : ''})`;
            this.crystalMessageTimer = 2;

            // Sparkle particles
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                game.addParticle({
                    x: obj.x + 12,
                    y: obj.y + 12,
                    vx: Math.cos(angle) * 80,
                    vy: Math.sin(angle) * 80,
                    size: 3,
                    color: ['#FFD700', '#FFAA00', '#FFFFFF'][Math.floor(Math.random() * 3)],
                    lifetime: 0.5,
                    maxLifetime: 0.5,
                    gravity: false
                });
            }
        }
    },

    _updateLockedDoor(obj, game) {
        if (obj.openAmount === undefined) obj.openAmount = 0;
        if (obj.triggered && obj.openAmount < 1) {
            obj.openAmount += game.deltaTime * 2;
            if (obj.openAmount >= 1) {
                Audio.play('puzzle');
            }
        }

        // If fully open, no collision
        if (obj.openAmount >= 1) return;

        const player = game.player;
        if (!player) return;

        const doorH = 64 * (1 - Math.min(1, obj.openAmount));
        const doorRect = { x: obj.x, y: obj.y + (64 - doorH), width: 32, height: doorH };

        if (Physics.overlap(player, doorRect)) {
            // Try to unlock with a key
            if (!obj.triggered && player.keys > 0) {
                player.keys--;
                obj.triggered = true;
                Audio.play('checkpoint');
                this.crystalMessage = 'Door unlocked!';
                this.crystalMessageTimer = 2;

                // Unlock particles
                for (let i = 0; i < 6; i++) {
                    game.addParticle({
                        x: obj.x + 16,
                        y: obj.y + 32,
                        vx: (Math.random() - 0.5) * 100,
                        vy: -Math.random() * 80,
                        size: 3,
                        color: '#FFD700',
                        lifetime: 0.5,
                        maxLifetime: 0.5,
                        gravity: true
                    });
                }
            } else if (!obj.triggered) {
                // Push player out
                const playerCenterX = player.x + player.width / 2;
                const doorCenterX = obj.x + 16;
                if (playerCenterX < doorCenterX) {
                    player.x = obj.x - player.width;
                } else {
                    player.x = obj.x + 32;
                }
                player.vx = 0;

                // Show hint
                if (!obj._hintShown || obj._hintTimer <= 0) {
                    this.crystalMessage = 'Locked! Find a key to open.';
                    this.crystalMessageTimer = 1.5;
                    obj._hintShown = true;
                    obj._hintTimer = 3;
                }
            }
        }
        if (obj._hintTimer > 0) obj._hintTimer -= game.deltaTime;
    },

    _updateDoor(obj, game) {
        if (obj.openAmount === undefined) obj.openAmount = 0;
        if (obj.triggered && obj.openAmount < 1) {
            obj.openAmount += game.deltaTime * 2;
            if (obj.openAmount >= 1) {
                Audio.play('puzzle');
            }
        }

        // Door blocks the player when closed
        if (obj.openAmount >= 1) return; // fully open, no collision

        const player = game.player;
        if (!player) return;

        const doorH = 64 * (1 - Math.min(1, obj.openAmount));
        const doorRect = { x: obj.x, y: obj.y + (64 - doorH), width: 32, height: doorH };

        if (Physics.overlap(player, doorRect)) {
            // Push player out of the door
            const playerCenterX = player.x + player.width / 2;
            const doorCenterX = obj.x + 16;
            if (playerCenterX < doorCenterX) {
                // Push left
                player.x = obj.x - player.width;
            } else {
                // Push right
                player.x = obj.x + 32;
            }
            player.vx = 0;
        }
    },

    render(ctx, obj, camera) {
        if (!Camera.isVisible(obj.x, obj.y, obj.width || 32, obj.height || 32)) return;

        const sx = Math.floor(Camera.screenX(obj.x));
        const sy = Math.floor(Camera.screenY(obj.y));

        switch (obj.type) {
            case 'pressurePlate':
                ctx.fillStyle = obj.active ? '#FFD700' : '#888';
                ctx.fillRect(sx + 4, sy + 28, 24, 4);
                break;
            case 'crystal':
                ctx.fillStyle = obj.triggered ? '#666' : '#AA44FF';
                ctx.beginPath();
                ctx.moveTo(sx + 16, sy + 4);
                ctx.lineTo(sx + 28, sy + 20);
                ctx.lineTo(sx + 16, sy + 28);
                ctx.lineTo(sx + 4, sy + 20);
                ctx.fill();
                if (!obj.triggered) {
                    ctx.globalAlpha = 0.3 + Math.sin(obj.animTimer * 3) * 0.2;
                    ctx.fillStyle = '#DD88FF';
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
                break;
            case 'movingPlatform':
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(sx, sy, obj.width || 64, 8);
                ctx.fillStyle = '#A0792C';
                ctx.fillRect(sx + 2, sy + 1, (obj.width || 64) - 4, 3);
                break;
            case 'pushBlock':
                ctx.fillStyle = '#777';
                ctx.fillRect(sx, sy, 32, 32);
                ctx.fillStyle = '#999';
                ctx.fillRect(sx + 2, sy + 2, 28, 28);
                ctx.strokeStyle = '#555';
                ctx.strokeRect(sx + 1, sy + 1, 30, 30);
                break;
            case 'door':
                const openAmt = obj.openAmount || 0;
                const doorH = 64 * (1 - Math.min(1, openAmt));
                ctx.fillStyle = '#5C3A1E';
                ctx.fillRect(sx, sy + (64 - doorH), 32, doorH);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(sx + 22, sy + 32, 4, 4);
                break;
            case 'springBoard': {
                const sbW = obj.width || 32;
                const bounce = (obj._bounceAnim > 0) ? Math.sin(obj._bounceAnim * 20) * 3 : 0;
                // Base/platform
                ctx.fillStyle = '#2a6a2a';
                ctx.fillRect(sx, sy + 4 + Math.floor(bounce), sbW, 8);
                // Spring coils
                ctx.fillStyle = '#44aa44';
                ctx.fillRect(sx + 4, sy + 2 + Math.floor(bounce), 4, 6);
                ctx.fillRect(sx + sbW - 8, sy + 2 + Math.floor(bounce), 4, 6);
                if (sbW > 32) ctx.fillRect(sx + Math.floor(sbW / 2) - 2, sy + 2 + Math.floor(bounce), 4, 6);
                // Top plate
                ctx.fillStyle = '#66cc66';
                ctx.fillRect(sx + 2, sy + Math.floor(bounce), sbW - 4, 4);
                // Arrow indicator
                ctx.fillStyle = '#aaffaa';
                ctx.globalAlpha = 0.5 + 0.3 * Math.sin((obj.animTimer || 0) * 4);
                ctx.beginPath();
                ctx.moveTo(sx + sbW / 2, sy - 6 + Math.floor(bounce));
                ctx.lineTo(sx + sbW / 2 - 5, sy + Math.floor(bounce));
                ctx.lineTo(sx + sbW / 2 + 5, sy + Math.floor(bounce));
                ctx.fill();
                ctx.globalAlpha = 1;
                break;
            }
            case 'key':
                if (!obj.triggered) {
                    const kt = obj.animTimer || 0;
                    const keyBob = Math.sin(kt * 3) * 3;
                    const kx = sx + 4;
                    const ky = sy + 4 + Math.floor(keyBob);
                    // Key glow
                    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(kt * 4);
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(kx + 8, ky + 8, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    // Key ring (circle)
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(kx + 6, ky + 5, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#CC9900';
                    ctx.beginPath();
                    ctx.arc(kx + 6, ky + 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                    // Key shaft
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(kx + 6, ky + 8, 2, 10);
                    // Key teeth
                    ctx.fillRect(kx + 8, ky + 14, 3, 2);
                    ctx.fillRect(kx + 8, ky + 10, 2, 2);
                    // Sparkle
                    ctx.fillStyle = '#FFF';
                    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(kt * 5);
                    ctx.fillRect(kx + 4, ky + 3, 2, 2);
                    ctx.globalAlpha = 1;
                }
                break;
            case 'lockedDoor': {
                const ldOpen = obj.openAmount || 0;
                const ldH = 64 * (1 - Math.min(1, ldOpen));
                if (ldH > 0) {
                    // Dark iron door
                    ctx.fillStyle = '#3a3040';
                    ctx.fillRect(sx, sy + (64 - ldH), 32, ldH);
                    // Iron bands
                    ctx.fillStyle = '#555060';
                    ctx.fillRect(sx + 2, sy + (64 - ldH) + 4, 28, 3);
                    ctx.fillRect(sx + 2, sy + (64 - ldH) + Math.floor(ldH * 0.4), 28, 3);
                    ctx.fillRect(sx + 2, sy + (64 - ldH) + Math.floor(ldH * 0.75), 28, 3);
                    // Lock
                    if (!obj.triggered) {
                        ctx.fillStyle = '#FFD700';
                        ctx.fillRect(sx + 13, sy + 28, 6, 8);
                        ctx.fillStyle = '#CC9900';
                        ctx.fillRect(sx + 14, sy + 30, 4, 4);
                        // Keyhole
                        ctx.fillStyle = '#222';
                        ctx.fillRect(sx + 15, sy + 31, 2, 3);
                    }
                    // Door edges
                    ctx.fillStyle = '#2a2030';
                    ctx.fillRect(sx, sy + (64 - ldH), 2, ldH);
                    ctx.fillRect(sx + 30, sy + (64 - ldH), 2, ldH);
                }
                break;
            }
        }
    }
};
