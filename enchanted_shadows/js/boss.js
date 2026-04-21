// Shadow King boss fight
const Boss = {
    create(x, y) {
        return {
            x, y,
            width: 40,
            height: 56,
            vx: 0, vy: 0,
            facing: -1,
            type: 'shadowKing',
            health: 20,
            maxHealth: 20,
            damage: 2,
            dead: false,
            deathTimer: 3,
            animTimer: 0,
            animState: 'idle',
            onGround: false,
            onWall: false,
            wallDir: 0,
            frozen: false,
            frozenTimer: 0,
            confused: false,
            confusedTimer: 0,
            attackCooldown: 0,
            phase: 1,       // 1, 2, 3 based on health
            attackPattern: 0,
            patternTimer: 0,
            invincible: false,
            invincibleTimer: 0,
            teleportTimer: 0,
            summonTimer: 10,
            // For rendering
            floatOffset: 0,
            auraTimer: 0
        };
    },

    update(boss, game) {
        if (boss.dead) {
            boss.deathTimer -= game.deltaTime;
            boss.animTimer += game.deltaTime;
            return boss.deathTimer <= 0;
        }

        boss.animTimer += game.deltaTime;
        boss.auraTimer += game.deltaTime;
        boss.floatOffset = Math.sin(boss.animTimer * 2) * 4;

        if (boss.frozen) {
            boss.frozenTimer -= game.deltaTime;
            if (boss.frozenTimer <= 0) boss.frozen = false;
            return false;
        }

        // Determine phase
        const hpPct = boss.health / boss.maxHealth;
        if (hpPct <= 0.33) boss.phase = 3;
        else if (hpPct <= 0.66) boss.phase = 2;
        else boss.phase = 1;

        boss.invincibleTimer = Math.max(0, boss.invincibleTimer - game.deltaTime);
        boss.invincible = boss.invincibleTimer > 0;

        const player = game.player;
        if (!player) return false;

        const dx = player.x - boss.x;
        boss.facing = dx > 0 ? 1 : -1;

        boss.patternTimer -= game.deltaTime;
        boss.attackCooldown -= game.deltaTime;
        boss.teleportTimer -= game.deltaTime;
        boss.summonTimer -= game.deltaTime;

        // Attack patterns
        if (boss.patternTimer <= 0) {
            boss.attackPattern = (boss.attackPattern + 1) % 4;
            switch (boss.attackPattern) {
                case 0: // Shadow bolt barrage
                    this._shadowBarrage(boss, game);
                    boss.patternTimer = boss.phase === 3 ? 1.5 : 2.5;
                    break;
                case 1: // Teleport behind player
                    this._teleport(boss, player, game);
                    boss.patternTimer = 2;
                    break;
                case 2: // Dark wave
                    this._darkWave(boss, game);
                    boss.patternTimer = boss.phase >= 2 ? 1.5 : 2.5;
                    break;
                case 3: // Summon minions (phase 2+)
                    if (boss.phase >= 2 && boss.summonTimer <= 0) {
                        this._summon(boss, game);
                        boss.summonTimer = 15;
                    }
                    boss.patternTimer = 2;
                    break;
            }
        }

        // Move toward player slowly
        const dist = Math.abs(dx);
        if (dist > 100) {
            boss.vx = boss.facing * 60;
        } else if (dist < 50) {
            boss.vx = -boss.facing * 40;
        } else {
            boss.vx = 0;
        }

        boss.x += boss.vx * game.deltaTime;
        boss.y += boss.floatOffset * game.deltaTime;

        // Contact damage
        if (player && Physics.overlap(boss, player)) {
            Player.hit(player, boss.damage, game);
        }

        return false;
    },

    _shadowBarrage(boss, game) {
        const count = boss.phase === 3 ? 5 : 3;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const angle = boss.facing === 1 ? -0.3 + i * 0.15 : Math.PI + 0.3 - i * 0.15;
                game.addProjectile({
                    x: boss.x + boss.width / 2,
                    y: boss.y + 16,
                    width: 12, height: 12,
                    vx: Math.cos(angle) * 250,
                    vy: Math.sin(angle) * 250,
                    damage: 2,
                    type: 'shadowbolt',
                    fromPlayer: false,
                    lifetime: 3
                });
            }, i * 150);
        }
        Audio.play('fireball');
    },

    _teleport(boss, player, game) {
        // Teleport particles at old position
        for (let i = 0; i < 10; i++) {
            game.addParticle({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                size: 4, color: '#6622AA',
                lifetime: 0.5, maxLifetime: 0.5, gravity: false
            });
        }
        // Move behind player
        boss.x = player.x + (player.facing * -60);
        boss.y = player.y - 10;
        boss.invincibleTimer = 0.3;
        Audio.play('dash');
    },

    _darkWave(boss, game) {
        // Shoot projectiles in a wave pattern
        for (let i = -2; i <= 2; i++) {
            game.addProjectile({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                width: 8, height: 8,
                vx: i * 80,
                vy: -200,
                damage: 1,
                type: 'shadowbolt',
                fromPlayer: false,
                lifetime: 2.5
            });
        }
        Audio.play('nosense');
    },

    _summon(boss, game) {
        // Spawn 1-2 shadow soldiers
        const count = boss.phase === 3 ? 2 : 1;
        for (let i = 0; i < count; i++) {
            const sx = boss.x + (i === 0 ? -80 : 80);
            game.enemies.push(Enemies.create('shadowSoldier', sx, boss.y));
        }
        Audio.play('nosense');
    },

    hit(boss, damage, type, game) {
        if (boss.dead || boss.invincible) return;
        boss.health -= damage;
        boss.invincibleTimer = 0.5;
        Audio.play('bosshit');

        for (let i = 0; i < 6; i++) {
            game.addParticle({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300,
                size: 4, color: '#8800CC',
                lifetime: 0.4, maxLifetime: 0.4, gravity: false
            });
        }

        if (boss.health <= 0) {
            boss.dead = true;
            boss.deathTimer = 3;
            Audio.play('victory');
        }
    }
};
