// Player module for Enchanted Shadows
// Character: Ninja Mage (blue & silver)
const Player = {

    create(x, y, name) {
        return {
            name: name || 'Ninja Mage',
            x: x,
            y: y,
            width: 20,
            height: 30,

            // Velocity (gravity handled by physics.js)
            vx: 0,
            vy: 0,

            // Physics flags (set by Physics.moveEntity)
            onGround: false,
            onWall: false,
            wallDir: 0, // -1 = wall on left, 1 = wall on right

            // Direction
            facing: 1, // 1 = right, -1 = left

            // Stats
            health: 6,
            maxHealth: 6,
            mana: 100,
            maxMana: 100,
            manaRegen: 8, // per second

            // Timers
            invincibleTimer: 0,
            attackCooldown: 0,
            castTimer: 0,

            // Shadow Dash state
            dashing: false,
            dashTimer: 0,
            dashDuration: 0.25, // seconds

            // Animation
            animState: 'idle',
            animTimer: 0,

            // Inventory
            keys: 0,

            // Flags
            alive: true
        };
    },

    update(player, game) {
        const dt = game.deltaTime;
        const input = Input;

        // --- Timers ---
        player.animTimer += dt;

        // Invincibility countdown
        if (player.invincibleTimer > 0) {
            player.invincibleTimer -= dt;
            if (player.invincibleTimer < 0) player.invincibleTimer = 0;
        }

        // Attack cooldown
        if (player.attackCooldown > 0) {
            player.attackCooldown -= dt;
            if (player.attackCooldown < 0) player.attackCooldown = 0;
        }

        // Cast animation timer
        if (player.castTimer > 0) {
            player.castTimer -= dt;
            if (player.castTimer < 0) player.castTimer = 0;
        }

        // Mana regen
        if (player.mana < player.maxMana) {
            player.mana = Math.min(player.maxMana, player.mana + player.manaRegen * dt);
        }

        // --- Shadow Dash update ---
        if (player.dashing) {
            player.dashTimer -= dt;
            if (player.dashTimer <= 0) {
                player.dashing = false;
                player.dashTimer = 0;
                player.invincibleTimer = 0;
            } else {
                // During dash: move at 3x speed, phase through normal walls but NOT dash-block tiles (16)
                player.vx = player.facing * 200 * 3;
                const oldX = player.x;
                player.x += player.vx * dt;
                const level = Levels.data[game.currentLevel];
                if (level) {
                    // Stop at level bounds and end dash
                    if (player.x < 32) {
                        player.x = 32;
                        player.vx = 0;
                        player.dashing = false;
                        player.dashTimer = 0;
                        player.invincibleTimer = 0;
                    }
                    if (player.x + player.width > (level.cols - 1) * 32) {
                        player.x = (level.cols - 1) * 32 - player.width;
                        player.vx = 0;
                        player.dashing = false;
                        player.dashTimer = 0;
                        player.invincibleTimer = 0;
                    }
                    // Check for dash-block tiles (tile 16) - these stop the dash
                    const ts = 32;
                    const top = Math.floor(player.y / ts);
                    const bot = Math.floor((player.y + player.height - 1) / ts);
                    const checkDir = player.facing;
                    // Scan tiles the player now overlaps
                    const leftCol = Math.floor(player.x / ts);
                    const rightCol = Math.floor((player.x + player.width) / ts);
                    let blocked = false;
                    for (let r = top; r <= bot; r++) {
                        for (let c = leftCol; c <= rightCol; c++) {
                            if (r >= 0 && r < level.rows && c >= 0 && c < level.cols) {
                                if (Physics.isDashBlock(level.tiles[r][c])) {
                                    blocked = true;
                                    break;
                                }
                            }
                        }
                        if (blocked) break;
                    }
                    if (blocked) {
                        // Push player out of the dash-block tile
                        if (checkDir === 1) {
                            // Was dashing right - push to left of the block
                            for (let c = leftCol; c <= rightCol; c++) {
                                for (let r = top; r <= bot; r++) {
                                    if (r >= 0 && r < level.rows && c >= 0 && c < level.cols && Physics.isDashBlock(level.tiles[r][c])) {
                                        player.x = c * ts - player.width;
                                        break;
                                    }
                                }
                            }
                        } else {
                            // Was dashing left - push to right of the block
                            for (let c = rightCol; c >= leftCol; c--) {
                                for (let r = top; r <= bot; r++) {
                                    if (r >= 0 && r < level.rows && c >= 0 && c < level.cols && Physics.isDashBlock(level.tiles[r][c])) {
                                        player.x = (c + 1) * ts;
                                        break;
                                    }
                                }
                            }
                        }
                        player.vx = 0;
                        player.dashing = false;
                        player.dashTimer = 0;
                        player.invincibleTimer = 0;
                    }
                }
                this._updateAnimState(player);
                return;
            }
        }

        // --- Horizontal Movement ---
        if (input.left) {
            player.vx = -200;
            player.facing = -1;
        } else if (input.right) {
            player.vx = 200;
            player.facing = 1;
        } else {
            player.vx = 0;
        }

        // --- Jump ---
        if (input.jump) {
            if (player.onGround) {
                // Normal jump
                player.vy = -520;
                player.onGround = false;
                Audio.play('jump');
            } else if (player.onWall) {
                // Wall jump: jump away from wall
                player.vy = -520;
                Audio.play('jump');
                player.vx = -player.wallDir * 250;
                player.facing = -player.wallDir;
                player.onWall = false;
            }
        }

        // --- Basic Attack: Ninja Star ---
        if (input.attack && player.attackCooldown <= 0) {
            player.attackCooldown = 0.3;
            player.castTimer = 0.15;
            Audio.play('attack');

            const starX = player.x + (player.facing === 1 ? player.width : -8);
            const starY = player.y + player.height * 0.35;

            game.addProjectile({
                x: starX,
                y: starY,
                width: 8,
                height: 8,
                vx: player.facing * 350,
                vy: 0,
                damage: 1,
                type: 'ninjastar',
                fromPlayer: true,
                lifetime: 1.5
            });

            // Spawn a small particle burst
            for (let i = 0; i < 3; i++) {
                game.addParticle({
                    x: starX,
                    y: starY,
                    vx: player.facing * (100 + Math.random() * 80),
                    vy: (Math.random() - 0.5) * 60,
                    size: 2,
                    color: '#c0c0c0',
                    lifetime: 0.3,
                    maxLifetime: 0.3,
                    gravity: false
                });
            }
        }

        // --- Spell 1: Fireball (20 mana, 2 damage) ---
        if (input.spell1 && player.mana >= 20) {
            player.mana -= 20;
            player.castTimer = 0.25;
            Audio.play('fireball');

            const fbX = player.x + (player.facing === 1 ? player.width : -12);
            const fbY = player.y + player.height * 0.3;

            game.addProjectile({
                x: fbX,
                y: fbY,
                width: 14,
                height: 10,
                vx: player.facing * 280,
                vy: 0,
                damage: 2,
                type: 'fireball',
                fromPlayer: true,
                lifetime: 2.0
            });

            // Fire particles
            for (let i = 0; i < 6; i++) {
                game.addParticle({
                    x: fbX,
                    y: fbY,
                    vx: player.facing * (60 + Math.random() * 100),
                    vy: (Math.random() - 0.5) * 80,
                    size: 3 + Math.random() * 3,
                    color: ['#ff4400', '#ff8800', '#ffcc00'][Math.floor(Math.random() * 3)],
                    lifetime: 0.4,
                    maxLifetime: 0.4,
                    gravity: false
                });
            }
        }

        // --- Spell 2: Freeze (25 mana, 180px radius, 3s) ---
        if (input.spell2 && player.mana >= 25) {
            player.mana -= 25;
            player.castTimer = 0.3;
            Audio.play('freeze');

            const cx = player.x + player.width / 2;
            const cy = player.y + player.height / 2;

            if (game.enemies) {
                for (const enemy of game.enemies) {
                    const ex = enemy.x + (enemy.width || 0) / 2;
                    const ey = enemy.y + (enemy.height || 0) / 2;
                    const dist = Math.sqrt((cx - ex) * (cx - ex) + (cy - ey) * (cy - ey));
                    if (dist <= 180) {
                        enemy.frozen = true;
                        enemy.frozenTimer = 3.0;
                    }
                }
            }

            // Ice burst particles
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i;
                game.addParticle({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * 150,
                    vy: Math.sin(angle) * 150,
                    size: 4,
                    color: ['#88ddff', '#aaeeff', '#ffffff'][Math.floor(Math.random() * 3)],
                    lifetime: 0.5,
                    maxLifetime: 0.5,
                    gravity: false
                });
            }
        }

        // --- Spell 3: Shadow Dash (15 mana) ---
        if (input.spell3 && player.mana >= 15 && !player.dashing) {
            player.mana -= 15;
            Audio.play('dash');
            player.dashing = true;
            player.dashTimer = player.dashDuration;
            player.invincibleTimer = player.dashDuration;
            player.vx = player.facing * 200 * 3;

            // Shadow particles at start
            for (let i = 0; i < 5; i++) {
                game.addParticle({
                    x: player.x + player.width / 2,
                    y: player.y + player.height / 2,
                    vx: -player.facing * (50 + Math.random() * 80),
                    vy: (Math.random() - 0.5) * 60,
                    size: 5 + Math.random() * 4,
                    color: ['#3333aa', '#5555cc', '#222244'][Math.floor(Math.random() * 3)],
                    lifetime: 0.4,
                    maxLifetime: 0.4,
                    gravity: false
                });
            }
        }

        // --- Spell 4: No-Sense (30 mana, 200px radius, 5s) ---
        if (input.spell4 && player.mana >= 30) {
            player.mana -= 30;
            player.castTimer = 0.35;
            Audio.play('nosense');

            const cx = player.x + player.width / 2;
            const cy = player.y + player.height / 2;

            if (game.enemies) {
                for (const enemy of game.enemies) {
                    const ex = enemy.x + (enemy.width || 0) / 2;
                    const ey = enemy.y + (enemy.height || 0) / 2;
                    const dist = Math.sqrt((cx - ex) * (cx - ex) + (cy - ey) * (cy - ey));
                    if (dist <= 200) {
                        enemy.confused = true;
                        enemy.confusedTimer = 5.0;
                    }
                }
            }

            // Purple/dark swirl particles
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 / 10) * i;
                game.addParticle({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * 120,
                    vy: Math.sin(angle) * 120,
                    size: 3 + Math.random() * 3,
                    color: ['#9900cc', '#6600aa', '#cc44ff'][Math.floor(Math.random() * 3)],
                    lifetime: 0.6,
                    maxLifetime: 0.6,
                    gravity: false
                });
            }
        }

        // --- Apply physics (gravity + tile collision) ---
        Physics.moveEntity(player, Levels.data[game.currentLevel], dt);

        // --- Check for spike damage ---
        const level = Levels.data[game.currentLevel];
        if (level) {
            const feetTile = Physics.getTileAt(level, player.x + player.width / 2, player.y + player.height + 1);
            if (feetTile === 7) {
                this.hit(player, 1, game);
                player.vy = -250;
            }
        }

        // --- Check for exit portal ---
        if (level) {
            const playerCX = player.x + player.width / 2;
            const playerCY = player.y + player.height / 2;
            const portalCol = Math.floor(playerCX / 32);
            const portalRow = Math.floor(playerCY / 32);
            if (portalRow >= 0 && portalRow < level.rows && portalCol >= 0 && portalCol < level.cols) {
                if (level.tiles[portalRow][portalCol] === 14) {
                    Audio.play('portal');
                    game.nextLevel();
                    return;
                }
            }
        }

        // --- Animation State ---
        this._updateAnimState(player);
    },

    _updateAnimState(player) {
        const prev = player.animState;

        if (player.dashing) {
            player.animState = 'dash';
        } else if (player.castTimer > 0) {
            player.animState = 'cast';
        } else if (!player.onGround && player.vy < 0) {
            player.animState = 'jump';
        } else if (!player.onGround && player.vy >= 0) {
            player.animState = 'fall';
        } else if (player.vx !== 0) {
            player.animState = 'run';
        } else {
            player.animState = 'idle';
        }

        // Reset anim timer on state change
        if (player.animState !== prev) {
            player.animTimer = 0;
        }
    },

    hit(player, damage, game) {
        // Ignore damage while invincible or dashing
        if (player.invincibleTimer > 0 || player.dashing) return;
        if (!player.alive) return;

        player.health -= damage;
        player.invincibleTimer = 1.0;
        Audio.play('hit');

        // Hurt particles
        for (let i = 0; i < 6; i++) {
            game.addParticle({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150,
                size: 3,
                color: '#ff0000',
                lifetime: 0.4,
                maxLifetime: 0.4,
                gravity: true
            });
        }

        if (player.health <= 0) {
            player.health = 0;
            player.alive = false;
        }
    }
};
