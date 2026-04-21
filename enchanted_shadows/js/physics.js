// Enchanted Shadows - Collision and platforming physics
const Physics = {
    GRAVITY: 900,
    TILE_SIZE: 32,
    MAX_FALL_SPEED: 600,

    // AABB overlap test between two rectangles {x, y, width, height}
    overlap(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },

    // Get tile value at a world position, 0 if out of bounds
    getTileAt(level, worldX, worldY) {
        const col = Math.floor(worldX / this.TILE_SIZE);
        const row = Math.floor(worldY / this.TILE_SIZE);
        if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) {
            return 0;
        }
        return level.tiles[row][col];
    },

    // Tiles 1-9 are solid (except 5 which is one-way platform), 15 (rock) and 16 (dash-block) too
    isSolid(tile) {
        return (tile >= 1 && tile <= 9 && tile !== 5) || tile === 15 || tile === 16;
    },

    // Dash-blocking tile check - these stop the Shadow Dash
    isDashBlock(tile) {
        return tile === 16;
    },

    // One-way platform check (tile 5 - wood platform)
    isOneWay(tile) {
        return tile === 5;
    },

    // Move entity with gravity, velocity, and tile collision resolution
    moveEntity(entity, level, dt) {
        // Apply gravity
        entity.vy += this.GRAVITY * dt;
        if (entity.vy > this.MAX_FALL_SPEED) {
            entity.vy = this.MAX_FALL_SPEED;
        }

        // Reset collision flags
        entity.onGround = false;
        entity.onWall = false;
        entity.wallDir = 0;

        // --- Move X axis ---
        entity.x += entity.vx * dt;
        this._resolveX(entity, level);

        // Clamp to level bounds (1 tile inset to prevent wall-jump on outer edge)
        const minX = this.TILE_SIZE;
        const maxX = (level.cols - 1) * this.TILE_SIZE - entity.width;
        if (entity.x < minX) { entity.x = minX; entity.vx = 0; }
        if (entity.x > maxX) { entity.x = maxX; entity.vx = 0; }

        // --- Move Y axis ---
        const prevY = entity.y;
        entity.y += entity.vy * dt;
        this._resolveY(entity, level, prevY);

        // --- Check wall contact (only while in air) ---
        if (!entity.onGround) {
            this._checkWallContact(entity, level);
        }
    },

    // Resolve horizontal tile collisions
    _resolveX(entity, level) {
        const top = Math.floor(entity.y / this.TILE_SIZE);
        const bottom = Math.floor((entity.y + entity.height - 1) / this.TILE_SIZE);
        const ts = this.TILE_SIZE;

        if (entity.vx > 0) {
            // Moving right - check right edge
            const col = Math.floor((entity.x + entity.width) / ts);
            for (let row = top; row <= bottom; row++) {
                if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
                const tile = level.tiles[row][col];
                if (this.isSolid(tile)) {
                    entity.x = col * ts - entity.width;
                    entity.vx = 0;
                    return;
                }
            }
        } else if (entity.vx < 0) {
            // Moving left - check left edge
            const col = Math.floor(entity.x / ts);
            for (let row = top; row <= bottom; row++) {
                if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
                const tile = level.tiles[row][col];
                if (this.isSolid(tile)) {
                    entity.x = (col + 1) * ts;
                    entity.vx = 0;
                    return;
                }
            }
        }
    },

    // Resolve vertical tile collisions
    _resolveY(entity, level, prevY) {
        const left = Math.floor(entity.x / this.TILE_SIZE);
        const right = Math.floor((entity.x + entity.width - 1) / this.TILE_SIZE);
        const ts = this.TILE_SIZE;

        if (entity.vy > 0) {
            // Falling down - check bottom edge
            const row = Math.floor((entity.y + entity.height) / ts);
            for (let col = left; col <= right; col++) {
                if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
                const tile = level.tiles[row][col];
                if (this.isSolid(tile)) {
                    entity.y = row * ts - entity.height;
                    entity.vy = 0;
                    entity.onGround = true;
                    return;
                }
                // One-way platform: only land if entity was above it before
                if (this.isOneWay(tile)) {
                    const prevBottom = prevY + entity.height;
                    const platformTop = row * ts;
                    if (prevBottom <= platformTop + 2) {
                        entity.y = platformTop - entity.height;
                        entity.vy = 0;
                        entity.onGround = true;
                        return;
                    }
                }
            }
        } else if (entity.vy < 0) {
            // Moving up - check top edge
            const row = Math.floor(entity.y / ts);
            for (let col = left; col <= right; col++) {
                if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
                const tile = level.tiles[row][col];
                // Don't bonk head on one-way platforms
                if (this.isSolid(tile)) {
                    entity.y = (row + 1) * ts;
                    entity.vy = 0;
                    return;
                }
            }
        }
    },

    // Check if entity is pressed against a wall while airborne
    _checkWallContact(entity, level) {
        const ts = this.TILE_SIZE;
        const top = Math.floor(entity.y / ts);
        const bottom = Math.floor((entity.y + entity.height - 1) / ts);

        // Check right side
        const rightCol = Math.floor((entity.x + entity.width + 1) / ts);
        for (let row = top; row <= bottom; row++) {
            if (row < 0 || row >= level.rows || rightCol < 0 || rightCol >= level.cols) continue;
            if (this.isSolid(level.tiles[row][rightCol])) {
                entity.onWall = true;
                entity.wallDir = 1;
                return;
            }
        }

        // Check left side
        const leftCol = Math.floor((entity.x - 1) / ts);
        for (let row = top; row <= bottom; row++) {
            if (row < 0 || row >= level.rows || leftCol < 0 || leftCol >= level.cols) continue;
            if (this.isSolid(level.tiles[row][leftCol])) {
                entity.onWall = true;
                entity.wallDir = -1;
                return;
            }
        }
    },

    // Check if entity is standing on a damage tile (spikes, tile 7)
    checkDamageTile(entity, level) {
        const ts = this.TILE_SIZE;
        const row = Math.floor((entity.y + entity.height) / ts);
        const left = Math.floor(entity.x / ts);
        const right = Math.floor((entity.x + entity.width - 1) / ts);

        for (let col = left; col <= right; col++) {
            if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
            if (level.tiles[row][col] === 7) {
                return true;
            }
        }
        return false;
    },

    // Check if entity is on ice (tile 8) - for slippery movement
    checkIceTile(entity, level) {
        const ts = this.TILE_SIZE;
        const row = Math.floor((entity.y + entity.height) / ts);
        const left = Math.floor(entity.x / ts);
        const right = Math.floor((entity.x + entity.width - 1) / ts);

        for (let col = left; col <= right; col++) {
            if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) continue;
            if (level.tiles[row][col] === 8) {
                return true;
            }
        }
        return false;
    }
};
