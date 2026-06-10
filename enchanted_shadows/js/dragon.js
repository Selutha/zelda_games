// The Black Dragon - mini-boss guarding the bridge to the Shadow Castle.
// The Shadow King's spell binds it: defeating it breaks the spell and FREES
// the dragon instead of killing it. It flies away grateful (and reappears
// on the victory screen).
//
// Tuning knobs live in create() and the TUNING object - tweak freely!
const Dragon = {

    TUNING: {
        hoverHeight: 250,        // world Y the dragon hovers at (lower = easier to hit)
        hoverDriftSpeed: 70,     // sideways drift while hovering
        telegraphTime: 0.8,      // seconds the mouth glows before an attack
        swoopSpeed: 300,         // dive speed across the bridge
        swoopTime: 1.5,          // how long a swoop lasts
        breathCount: 3,          // fireballs per breath
        breathSpeed: 220,        // fireball speed
        pauseBetweenAttacks: 2.2,        // phase 1
        pauseBetweenAttacksPhase2: 1.4   // phase 2 (below half health)
    },

    create(x, y) {
        return {
            x, y,
            width: 72,
            height: 44,
            vx: 0, vy: 0,
            facing: -1,
            type: 'blackDragon',
            isBoss: true,
            bossName: 'THE BLACK DRAGON',
            health: 16,
            maxHealth: 16,
            damage: 1,           // contact damage - gentle, it's a mid-game boss
            dead: false,         // never set: the dragon is freed, not slain
            deathTimer: 0,
            animTimer: 0,
            animState: 'fly',
            onGround: false, onWall: false, wallDir: 0,
            frozen: false, frozenTimer: 0,
            confused: false, confusedTimer: 0,
            attackCooldown: 0,

            phase: 1,
            _lastPhase: undefined,

            // Attack state machine: hover -> telegraph -> (breath | swoop) -> hover
            action: 'hover',
            actionTimer: 0,
            nextAttack: 'breath',
            patternTimer: 2.5,   // breather before the first attack
            hoverY: y,
            swoopVX: 0, swoopVY: 0,

            // Freed sequence
            freed: false,
            freedTimer: 0,
            invincibleTimer: 0
        };
    },

    update(dragon, game) {
        const dt = game.deltaTime;
        dragon.animTimer += dt;

        // --- Freed: hover gratefully, then soar away. true = level complete ---
        if (dragon.freed) {
            dragon.freedTimer -= dt;
            if (dragon.freedTimer < 2) {
                // Fly up and away
                dragon.y -= 170 * dt;
                dragon.x += dragon.facing * 60 * dt;
            } else {
                // A gentle thank-you hover with golden sparkles
                dragon.y += Math.sin(dragon.animTimer * 2) * 8 * dt;
                if (Math.random() < 0.2) {
                    game.addParticle({
                        x: dragon.x + Math.random() * dragon.width,
                        y: dragon.y + Math.random() * dragon.height,
                        vx: (Math.random() - 0.5) * 40,
                        vy: -30 - Math.random() * 40,
                        size: 3,
                        color: ['#FFD700', '#FFF4AA', '#FFFFFF'][Math.floor(Math.random() * 3)],
                        lifetime: 0.7, maxLifetime: 0.7, gravity: false
                    });
                }
            }
            return dragon.freedTimer <= 0;
        }

        if (dragon.frozen) {
            dragon.frozenTimer -= dt;
            if (dragon.frozenTimer <= 0) dragon.frozen = false;
            return false;
        }

        const player = game.player;
        if (!player) return false;

        dragon.invincibleTimer = Math.max(0, dragon.invincibleTimer - dt);

        // Phase 2 below half health - faster attacks, and a heart so the fight stays fair
        dragon.phase = dragon.health / dragon.maxHealth <= 0.5 ? 2 : 1;
        if (dragon.phase !== dragon._lastPhase) {
            if (dragon._lastPhase !== undefined) {
                game.addPickup({
                    type: 'heart',
                    x: dragon.x + dragon.width / 2 - 8, y: dragon.y,
                    width: 16, height: 16,
                    vy: -200, gravity: true, lifetime: 15, animTimer: 0
                });
            }
            dragon._lastPhase = dragon.phase;
        }

        const playerCenterX = player.x + player.width / 2;
        const dragonCenterX = dragon.x + dragon.width / 2;
        const tuning = this.TUNING;

        switch (dragon.action) {
            case 'hover': {
                dragon.facing = playerCenterX > dragonCenterX ? 1 : -1;
                // Bob in the air and drift to keep a little distance from the player
                dragon.y += (tuning.hoverHeight + Math.sin(dragon.animTimer * 2) * 10 - dragon.y) * 2 * dt;
                const wantedX = playerCenterX - dragon.facing * 180 - dragon.width / 2;
                dragon.x += Math.max(-tuning.hoverDriftSpeed, Math.min(tuning.hoverDriftSpeed,
                    (wantedX - dragon.x))) * dt;

                dragon.patternTimer -= dt;
                if (dragon.patternTimer <= 0) {
                    // Alternate attacks so they're learnable
                    dragon.nextAttack = dragon.nextAttack === 'breath' ? 'swoop' : 'breath';
                    dragon.action = 'telegraph';
                    dragon.actionTimer = tuning.telegraphTime;
                    Audio.play('roar');
                }
                break;
            }

            case 'telegraph': {
                // Mouth glows (sprite reads dragon.action) - the cue to get ready
                dragon.actionTimer -= dt;
                dragon.x += Math.sin(dragon.animTimer * 30) * 20 * dt;   // tense shiver
                if (dragon.actionTimer <= 0) {
                    if (dragon.nextAttack === 'breath') {
                        this._breatheFire(dragon, game);
                        dragon.action = 'hover';
                        dragon.patternTimer = dragon.phase === 2 ?
                            tuning.pauseBetweenAttacksPhase2 : tuning.pauseBetweenAttacks;
                    } else {
                        dragon.action = 'swoop';
                        dragon.actionTimer = tuning.swoopTime;
                        const targetY = player.y + player.height / 2 - dragon.height / 2;
                        const dx = playerCenterX - dragonCenterX;
                        const dy = targetY - dragon.y;
                        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
                        dragon.swoopVX = (dx / dist) * tuning.swoopSpeed;
                        dragon.swoopVY = (dy / dist) * tuning.swoopSpeed;
                    }
                }
                break;
            }

            case 'swoop': {
                dragon.actionTimer -= dt;
                dragon.x += dragon.swoopVX * dt;
                dragon.y += dragon.swoopVY * dt;
                // Level out once at ground height, keep racing across
                const level = Levels.data[game.currentLevel];
                const floorY = level.heightPx - 64 - dragon.height;
                if (dragon.y > floorY) { dragon.y = floorY; dragon.swoopVY = 0; }
                // Turn around at the bridge walls
                if (dragon.x < 48) { dragon.x = 48; dragon.actionTimer = 0; }
                if (dragon.x + dragon.width > level.widthPx - 48) {
                    dragon.x = level.widthPx - 48 - dragon.width;
                    dragon.actionTimer = 0;
                }
                if (dragon.actionTimer <= 0) {
                    dragon.action = 'hover';
                    dragon.patternTimer = dragon.phase === 2 ?
                        tuning.pauseBetweenAttacksPhase2 : tuning.pauseBetweenAttacks;
                }
                break;
            }
        }

        // Contact damage (player invincibility frames keep this gentle)
        if (Physics.overlap(dragon, player)) {
            Player.hit(player, dragon.damage, game);
        }

        return false;
    },

    _breatheFire(dragon, game) {
        const player = game.player;
        const mouthX = dragon.x + (dragon.facing === 1 ? dragon.width - 6 : -6);
        const mouthY = dragon.y + 14;
        const targetX = player.x + player.width / 2;
        const targetY = player.y + player.height / 2;
        const baseAngle = Math.atan2(targetY - mouthY, targetX - mouthX);
        const tuning = this.TUNING;

        for (let i = 0; i < tuning.breathCount; i++) {
            const spread = (i - (tuning.breathCount - 1) / 2) * 0.22;
            const angle = baseAngle + spread;
            game.addProjectile({
                x: mouthX, y: mouthY,
                width: 12, height: 12,
                vx: Math.cos(angle) * tuning.breathSpeed,
                vy: Math.sin(angle) * tuning.breathSpeed,
                damage: 1,
                type: 'dragonfire',
                fromPlayer: false,
                lifetime: 2.5
            });
        }
        Audio.play('fireball');
    },

    hit(dragon, damage, type, game) {
        if (dragon.freed || dragon.invincibleTimer > 0) return;
        dragon.health -= damage;
        dragon.invincibleTimer = 0.4;
        Audio.play('bosshit');
        game.triggerShake(0.15, 3);

        for (let i = 0; i < 6; i++) {
            game.addParticle({
                x: dragon.x + dragon.width / 2,
                y: dragon.y + dragon.height / 2,
                vx: (Math.random() - 0.5) * 280,
                vy: (Math.random() - 0.5) * 280,
                size: 4, color: '#7733CC',
                lifetime: 0.4, maxLifetime: 0.4, gravity: false
            });
        }

        if (dragon.health <= 0) {
            dragon.health = 0;
            this._free(dragon, game);
        }
    },

    // The spell shatters: the dragon turns friendly instead of dying
    _free(dragon, game) {
        dragon.freed = true;
        dragon.freedTimer = 4.5;
        dragon.facing = 1;
        Audio.play('dragonfree');
        Puzzles.crystalMessage = 'The spell is broken - the dragon is FREE!';
        Puzzles.crystalMessageTimer = 4;

        // Purple spell-shatter burst turning to gold
        for (let i = 0; i < 24; i++) {
            const angle = (Math.PI * 2 / 24) * i;
            game.addParticle({
                x: dragon.x + dragon.width / 2,
                y: dragon.y + dragon.height / 2,
                vx: Math.cos(angle) * (120 + Math.random() * 120),
                vy: Math.sin(angle) * (120 + Math.random() * 120),
                size: 4,
                color: i % 2 === 0 ? '#7733CC' : '#FFD700',
                lifetime: 0.8, maxLifetime: 0.8, gravity: false
            });
        }
    }
};
