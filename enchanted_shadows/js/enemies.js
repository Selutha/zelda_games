// Enemy system for Enchanted Shadows
const Enemies = {
    spawn(enemyData) {
        return enemyData.map(data => this.create(data.type, data.x, data.y));
    },

    create(type, x, y) {
        if (type === 'shadowKing') return Boss.create(x, y);

        const base = {
            x, y,
            vx: 0, vy: 0,
            facing: -1,
            type,
            health: 2,
            damage: 1,
            dead: false,
            deathTimer: 0.5,
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
            patrolDir: 1,
            patrolTimer: 0,
            aggroRange: 200,
            attackRange: 40,
        };

        switch (type) {
            case 'wolf':
                return { ...base, width: 28, height: 20, health: 2, damage: 1, speed: 120, aggroRange: 250 };
            case 'bat':
                return { ...base, width: 24, height: 16, health: 1, damage: 1, speed: 80, flying: true, flyY: y, flyAmplitude: 30 };
            case 'spider':
                return { ...base, width: 24, height: 18, health: 2, damage: 1, speed: 60, aggroRange: 150 };
            case 'shadowSoldier':
                return { ...base, width: 22, height: 32, health: 4, damage: 2, speed: 80, aggroRange: 200, attackRange: 35 };
            case 'skeletonMage':
                return { ...base, width: 20, height: 32, health: 3, damage: 2, speed: 40, aggroRange: 280, attackRange: 250, shootCooldown: 2 };
            default:
                return { ...base, width: 24, height: 24, health: 2, speed: 60 };
        }
    },

    update(enemy, game) {
        if (enemy.type === 'shadowKing') {
            if (Boss.update(enemy, game)) {
                game.state = game.STATE.VICTORY;
            }
            return;
        }

        if (enemy.dead) {
            enemy.deathTimer -= game.deltaTime;
            return;
        }

        enemy.animTimer += game.deltaTime;

        // Frozen - can't act
        if (enemy.frozen) {
            enemy.frozenTimer -= game.deltaTime;
            if (enemy.frozenTimer <= 0) {
                enemy.frozen = false;
            }
            enemy.vx = 0;
            return;
        }

        // Confused - wander randomly
        if (enemy.confused) {
            enemy.confusedTimer -= game.deltaTime;
            if (enemy.confusedTimer <= 0) {
                enemy.confused = false;
            }
            enemy.patrolTimer -= game.deltaTime;
            if (enemy.patrolTimer <= 0) {
                enemy.patrolDir = Math.random() > 0.5 ? 1 : -1;
                enemy.patrolTimer = 0.5 + Math.random();
            }
            enemy.vx = enemy.patrolDir * enemy.speed * 0.5;
            enemy.facing = enemy.patrolDir;
            if (!enemy.flying) {
                Physics.moveEntity(enemy, Levels.data[game.currentLevel], game.deltaTime);
            } else {
                enemy.x += enemy.vx * game.deltaTime;
                enemy.y = enemy.flyY + Math.sin(enemy.animTimer * 2) * enemy.flyAmplitude;
            }
            return;
        }

        const player = game.player;
        if (!player) return;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        enemy.attackCooldown = Math.max(0, enemy.attackCooldown - game.deltaTime);

        if (dist < enemy.aggroRange) {
            // Chase player
            enemy.facing = dx > 0 ? 1 : -1;

            if (enemy.type === 'skeletonMage') {
                // Ranged attacker - keep distance and shoot
                if (dist < 100) {
                    enemy.vx = -enemy.facing * enemy.speed;
                } else if (dist > 200) {
                    enemy.vx = enemy.facing * enemy.speed;
                } else {
                    enemy.vx = 0;
                }
                if (enemy.attackCooldown <= 0 && dist < enemy.attackRange) {
                    this._shoot(enemy, game);
                    enemy.attackCooldown = enemy.shootCooldown;
                }
            } else if (enemy.flying) {
                // Fly toward player
                enemy.vx = Math.sign(dx) * enemy.speed;
                const targetY = player.y - 20;
                enemy.y += (targetY - enemy.y) * 0.02;
                enemy.x += enemy.vx * game.deltaTime;
            } else {
                enemy.vx = enemy.facing * enemy.speed;
            }

            // Melee attack
            if (dist < enemy.attackRange && enemy.attackCooldown <= 0 && enemy.type !== 'skeletonMage') {
                Player.hit(player, enemy.damage, game);
                enemy.attackCooldown = 1;
            }
        } else {
            // Patrol
            enemy.patrolTimer -= game.deltaTime;
            if (enemy.patrolTimer <= 0) {
                enemy.patrolDir *= -1;
                enemy.patrolTimer = 2 + Math.random() * 2;
            }
            enemy.vx = enemy.patrolDir * enemy.speed * 0.5;
            enemy.facing = enemy.patrolDir;

            if (enemy.flying) {
                enemy.x += enemy.vx * game.deltaTime;
                enemy.y = enemy.flyY + Math.sin(enemy.animTimer * 2) * enemy.flyAmplitude;
            }
        }

        // Apply physics for ground enemies
        if (!enemy.flying) {
            Physics.moveEntity(enemy, Levels.data[game.currentLevel], game.deltaTime);

            // Turn around at edges
            if (enemy.onWall) {
                enemy.patrolDir *= -1;
                enemy.facing = enemy.patrolDir;
            }
        }

        // Player collision damage
        if (player && !player.invincibleTimer && !player.dashing && Physics.overlap(enemy, player)) {
            Player.hit(player, enemy.damage, game);
        }
    },

    _shoot(enemy, game) {
        const dir = enemy.facing;
        game.addProjectile({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + 8,
            width: 10,
            height: 10,
            vx: dir * 200,
            vy: 0,
            damage: enemy.damage,
            type: enemy.type === 'skeletonMage' ? 'skullfire' : 'shadowbolt',
            fromPlayer: false,
            lifetime: 3
        });
    },

    hit(enemy, damage, type, game) {
        if (enemy.type === 'shadowKing') {
            Boss.hit(enemy, damage, type, game);
            return;
        }
        if (enemy.dead) return;
        enemy.health -= damage;
        Audio.play('enemyHit');

        // Knockback
        const kb = enemy.x < game.player.x ? -1 : 1;
        enemy.vx = kb * 150;

        if (enemy.health <= 0) {
            enemy.dead = true;
            enemy.deathTimer = 0.5;
            Audio.play('enemyDie');

            // Drop particles
            for (let i = 0; i < 8; i++) {
                game.addParticle({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: (Math.random() - 0.5) * 200,
                    vy: (Math.random() - 0.5) * 200 - 100,
                    size: 3,
                    color: enemy.type === 'skeletonMage' ? '#AAFFAA' : '#8844AA',
                    lifetime: 0.5,
                    maxLifetime: 0.5,
                    gravity: true
                });
            }
        }
    }
};
