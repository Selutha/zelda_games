// Camera system - follows the player with smooth scrolling
const Camera = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    smoothing: 0.1,
    // How far ahead of center the camera looks in the direction the player faces
    lookAhead: 40,

    init(width, height) {
        this.width = width;
        this.height = height;
    },

    follow(target, levelWidth, levelHeight) {
        // Target position: center on player with slight look-ahead
        let targetX = target.x + target.width / 2 - this.width / 2;
        let targetY = target.y + target.height / 2 - this.height / 2;

        if (target.facing === 1) {
            targetX += this.lookAhead;
        } else {
            targetX -= this.lookAhead;
        }

        // Smooth follow
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Clamp to level bounds
        this.x = Math.max(0, Math.min(this.x, levelWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, levelHeight - this.height));
    },

    // Convert world coordinates to screen coordinates
    screenX(worldX) {
        return worldX - this.x;
    },

    screenY(worldY) {
        return worldY - this.y;
    },

    // Check if a rectangle is visible on screen
    isVisible(x, y, w, h) {
        return x + w > this.x && x < this.x + this.width &&
               y + h > this.y && y < this.y + this.height;
    }
};
