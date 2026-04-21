// Input handling for Enchanted Shadows
const Input = {
    keys: {},
    justPressed: {},
    _prevKeys: {},

    init() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            this.keys[e.code] = false;
        });
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    },

    update() {
        for (const code in this.keys) {
            this.justPressed[code] = this.keys[code] && !this._prevKeys[code];
        }
        this._prevKeys = { ...this.keys };
    },

    isDown(code) {
        return !!this.keys[code];
    },

    wasPressed(code) {
        return !!this.justPressed[code];
    },

    // Convenience getters for game controls
    get left() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); },
    get right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); },
    get up() { return this.isDown('ArrowUp') || this.isDown('KeyW'); },
    get down() { return this.isDown('ArrowDown') || this.isDown('KeyS'); },
    get jump() { return this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); },
    get attack() { return this.wasPressed('KeyJ') || this.wasPressed('KeyZ'); },
    get spell1() { return this.wasPressed('Digit1'); },  // Fireball
    get spell2() { return this.wasPressed('Digit2'); },  // Freeze
    get spell3() { return this.wasPressed('Digit3'); },  // Shadow Dash
    get spell4() { return this.wasPressed('Digit4'); },  // No-Sense
    get pause() { return this.wasPressed('Escape') || this.wasPressed('KeyP'); },
    get confirm() { return this.wasPressed('Enter') || this.wasPressed('Space'); }
};
