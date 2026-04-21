// Sprites module for Enchanted Shadows
// All art is drawn procedurally with Canvas 2D calls - no image files
const Sprites = {

    // =========================================================================
    // HELPER: drawPixels
    // Draws a pixel pattern from an array of strings using a color map.
    //   colorMap: { 'B': '#0000ff', 'R': '#ff0000', ... }
    //   pattern:  ['..BB..', '.BRRB.', 'BBRRBB']
    //   '.' or ' ' = transparent (skip)
    // =========================================================================
    drawPixels(ctx, x, y, scale, colorMap, pattern) {
        for (let row = 0; row < pattern.length; row++) {
            const line = pattern[row];
            for (let col = 0; col < line.length; col++) {
                const ch = line[col];
                if (ch === '.' || ch === ' ') continue;
                const color = colorMap[ch];
                if (!color) continue;
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.floor(x + col * scale),
                    Math.floor(y + row * scale),
                    scale, scale
                );
            }
        }
    },

    // =========================================================================
    // drawBackground
    // =========================================================================
    drawBackground(ctx, theme, camera) {
        const w = camera.width;
        const h = camera.height;
        const t = Date.now() / 1000;

        if (theme === 'forest') {
            // --- Sky gradient: dark blue-green ---
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#0a1628');
            grad.addColorStop(0.4, '#0f2b3a');
            grad.addColorStop(0.7, '#163a2a');
            grad.addColorStop(1, '#1a2e1a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // --- Stars ---
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 80; i++) {
                const sx = (i * 137 + 51) % w;
                const sy = (i * 97 + 23) % (h * 0.45);
                const brightness = 0.3 + 0.7 * ((Math.sin(t * 0.8 + i * 1.3) + 1) / 2);
                ctx.globalAlpha = brightness * 0.8;
                const size = (i % 5 === 0) ? 3 : (i % 3 === 0) ? 2 : 1;
                ctx.fillRect(Math.floor(sx), Math.floor(sy), size, size);
            }
            ctx.globalAlpha = 1;

            // --- Moon ---
            const moonX = w * 0.78;
            const moonY = h * 0.12;
            // Moon glow
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = '#aaccff';
            ctx.beginPath();
            ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.15;
            ctx.beginPath();
            ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
            ctx.fill();
            // Moon body
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = '#ddeeff';
            ctx.beginPath();
            ctx.arc(moonX, moonY, 16, 0, Math.PI * 2);
            ctx.fill();
            // Crescent shadow
            ctx.fillStyle = '#0f2b3a';
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.arc(moonX + 6, moonY - 2, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // --- Distant mountains (parallax 0.1x) ---
            const mOffset = Math.floor(camera.x * 0.1) % w;
            ctx.fillStyle = '#0d2218';
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let mx = -100; mx <= w + 100; mx += 80) {
                const mh = 80 + 60 * Math.sin((mx + mOffset) * 0.008) +
                           30 * Math.sin((mx + mOffset) * 0.02 + 2);
                ctx.lineTo(mx, h * 0.55 - mh);
            }
            ctx.lineTo(w + 100, h);
            ctx.closePath();
            ctx.fill();

            // --- Background trees layer (parallax 0.3x) ---
            const treeOffset03 = Math.floor(camera.x * 0.3);
            ctx.fillStyle = '#0a2a12';
            for (let i = 0; i < 20; i++) {
                const tx = ((i * 120 + 30) - treeOffset03 % (20 * 120) + 20 * 120) % (20 * 120) - 200;
                if (tx < -60 || tx > w + 60) continue;
                const th = 80 + (i * 37 % 50);
                const treeY = h * 0.65 - th;
                // Trunk
                ctx.fillStyle = '#1a1208';
                ctx.fillRect(Math.floor(tx + 10), Math.floor(treeY + th * 0.5), 8, Math.floor(th * 0.5));
                // Canopy - layered triangles
                ctx.fillStyle = '#0a2a12';
                for (let layer = 0; layer < 3; layer++) {
                    const lw = 40 - layer * 8;
                    const ly = treeY + layer * 18;
                    ctx.beginPath();
                    ctx.moveTo(Math.floor(tx + 14), Math.floor(ly));
                    ctx.lineTo(Math.floor(tx + 14 - lw / 2), Math.floor(ly + 30));
                    ctx.lineTo(Math.floor(tx + 14 + lw / 2), Math.floor(ly + 30));
                    ctx.closePath();
                    ctx.fill();
                }
            }

            // --- Mid trees layer (parallax 0.5x) ---
            const treeOffset05 = Math.floor(camera.x * 0.5);
            for (let i = 0; i < 15; i++) {
                const tx = ((i * 150 + 80) - treeOffset05 % (15 * 150) + 15 * 150) % (15 * 150) - 200;
                if (tx < -80 || tx > w + 80) continue;
                const th = 100 + (i * 53 % 60);
                const treeY = h * 0.7 - th;
                // Trunk
                ctx.fillStyle = '#2a1e0c';
                ctx.fillRect(Math.floor(tx + 14), Math.floor(treeY + th * 0.45), 10, Math.floor(th * 0.55));
                // Canopy
                ctx.fillStyle = '#143a1a';
                for (let layer = 0; layer < 3; layer++) {
                    const lw = 50 - layer * 10;
                    const ly = treeY + layer * 22;
                    ctx.beginPath();
                    ctx.moveTo(Math.floor(tx + 19), Math.floor(ly));
                    ctx.lineTo(Math.floor(tx + 19 - lw / 2), Math.floor(ly + 35));
                    ctx.lineTo(Math.floor(tx + 19 + lw / 2), Math.floor(ly + 35));
                    ctx.closePath();
                    ctx.fill();
                }
            }

            // --- Ground bushes/mushrooms (parallax 0.6x) ---
            const bushOffset = Math.floor(camera.x * 0.6);
            for (let i = 0; i < 12; i++) {
                const bx = ((i * 180 + 50) - bushOffset % (12 * 180) + 12 * 180) % (12 * 180) - 100;
                if (bx < -40 || bx > w + 40) continue;
                const bushY = h * 0.78;
                if (i % 3 === 0) {
                    // Mushroom
                    ctx.fillStyle = '#2a1a0a';
                    ctx.fillRect(Math.floor(bx + 8), Math.floor(bushY + 4), 4, 8);
                    ctx.fillStyle = '#8a2222';
                    ctx.beginPath();
                    ctx.arc(Math.floor(bx + 10), Math.floor(bushY + 4), 8, Math.PI, 0);
                    ctx.fill();
                    // Spots
                    ctx.fillStyle = '#ddccaa';
                    ctx.fillRect(Math.floor(bx + 6), Math.floor(bushY), 2, 2);
                    ctx.fillRect(Math.floor(bx + 12), Math.floor(bushY + 1), 2, 2);
                } else {
                    // Bush
                    ctx.fillStyle = '#0e3a12';
                    ctx.beginPath();
                    ctx.arc(Math.floor(bx + 10), Math.floor(bushY + 6), 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#1a4a1e';
                    ctx.beginPath();
                    ctx.arc(Math.floor(bx + 16), Math.floor(bushY + 4), 7, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // --- Floating fireflies ---
            for (let i = 0; i < 30; i++) {
                const fx = (i * 173 + 41 + Math.sin(t * 0.5 + i * 2.1) * 30) % w;
                const fy = h * 0.3 + (i * 91 % (h * 0.5)) + Math.sin(t * 0.7 + i * 1.7) * 15;
                const pulse = 0.3 + 0.7 * ((Math.sin(t * 2.5 + i * 3.3) + 1) / 2);
                ctx.globalAlpha = pulse * 0.7;
                ctx.fillStyle = '#aaffaa';
                ctx.fillRect(Math.floor(fx), Math.floor(fy), 2, 2);
                // Glow
                ctx.globalAlpha = pulse * 0.15;
                ctx.fillStyle = '#66ff66';
                ctx.fillRect(Math.floor(fx - 2), Math.floor(fy - 2), 6, 6);
            }
            ctx.globalAlpha = 1;

            // --- Low mist / fog layers ---
            for (let i = 0; i < 5; i++) {
                const mistX = ((i * 220 + t * 8 + Math.sin(t * 0.3 + i) * 40) % (w + 200)) - 100;
                const mistY = h * 0.72 + i * 12 + Math.sin(t * 0.4 + i * 1.5) * 5;
                const mistW = 120 + (i * 37 % 80);
                ctx.globalAlpha = 0.04 + 0.02 * Math.sin(t * 0.5 + i * 2);
                ctx.fillStyle = '#aaddaa';
                ctx.beginPath();
                ctx.ellipse(Math.floor(mistX + mistW / 2), Math.floor(mistY), mistW / 2, 8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

        } else if (theme === 'castle') {
            // --- Dark purple/grey gradient ---
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#0a0610');
            grad.addColorStop(0.5, '#140e1e');
            grad.addColorStop(1, '#1a1225');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // --- Stone wall pattern in background (parallax 0.2x) ---
            const wallOx = Math.floor(camera.x * 0.2) % 64;
            const wallOy = Math.floor(camera.y * 0.2) % 32;
            ctx.fillStyle = '#1e1828';
            ctx.globalAlpha = 0.4;
            for (let wy = -32; wy < h + 32; wy += 32) {
                const rowOff = (Math.floor((wy + wallOy) / 32) % 2) * 32;
                for (let wx = -64; wx < w + 64; wx += 64) {
                    const bx = Math.floor(wx - wallOx + rowOff);
                    const by = Math.floor(wy - wallOy);
                    // Brick outline
                    ctx.strokeStyle = '#28203a';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(bx, by, 64, 32);
                }
            }
            ctx.globalAlpha = 1;

            // --- Flickering torch glow (a few in background) ---
            for (let i = 0; i < 4; i++) {
                const torchX = (i * (w / 4) + w / 8);
                const torchY = h * 0.4;
                const flicker = 0.5 + 0.3 * Math.sin(t * 5 + i * 2.5) +
                                0.2 * Math.sin(t * 8.3 + i * 1.7);
                const radius = 60 + 20 * flicker;
                const glow = ctx.createRadialGradient(
                    Math.floor(torchX), Math.floor(torchY), 0,
                    Math.floor(torchX), Math.floor(torchY), radius
                );
                glow.addColorStop(0, `rgba(255, 150, 50, ${0.12 * flicker})`);
                glow.addColorStop(0.5, `rgba(255, 100, 20, ${0.05 * flicker})`);
                glow.addColorStop(1, 'rgba(255, 80, 0, 0)');
                ctx.fillStyle = glow;
                ctx.fillRect(
                    Math.floor(torchX - radius),
                    Math.floor(torchY - radius),
                    radius * 2, radius * 2
                );
            }

            // --- Dust particles ---
            ctx.fillStyle = '#aaa';
            for (let i = 0; i < 15; i++) {
                const dx = (i * 211 + Math.sin(t * 0.3 + i) * 40 + t * 5) % w;
                const dy = (i * 139 + t * 8 + Math.sin(t * 0.5 + i * 2) * 20) % h;
                ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t + i);
                ctx.fillRect(Math.floor(dx), Math.floor(dy), 1, 1);
            }
            ctx.globalAlpha = 1;
        }
    },

    // =========================================================================
    // drawTile
    // =========================================================================
    drawTile(ctx, tileType, x, y, theme) {
        const S = 32; // tile size
        const px = Math.floor(x);
        const py = Math.floor(y);
        const t = Date.now() / 1000;

        switch (tileType) {
            case 0: // empty
            case 9: // invisible wall
                break;

            case 1: { // grass top
                if (theme === 'castle') {
                    // Mossy grey-green top
                    ctx.fillStyle = '#3a4a38';
                    ctx.fillRect(px, py, S, 4);
                    ctx.fillStyle = '#4a5a48';
                    // Grass blades
                    for (let gx = 0; gx < S; gx += 4) {
                        const gh = 2 + (gx * 7 % 3);
                        ctx.fillRect(px + gx, py - gh + 4, 2, gh);
                    }
                    // Dirt below
                    ctx.fillStyle = '#3a3028';
                    ctx.fillRect(px, py + 4, S, S - 4);
                    ctx.fillStyle = '#302820';
                    ctx.fillRect(px + 5, py + 12, 4, 3);
                    ctx.fillRect(px + 18, py + 20, 5, 3);
                } else {
                    // Lush green top
                    ctx.fillStyle = '#3a8a2a';
                    ctx.fillRect(px, py, S, 4);
                    ctx.fillStyle = '#4aaa3a';
                    // Grass blades on top
                    for (let gx = 0; gx < S; gx += 3) {
                        const gh = 2 + (gx * 13 % 4);
                        ctx.fillRect(px + gx, py - gh + 4, 2, gh);
                    }
                    // Brown dirt body
                    ctx.fillStyle = '#8a6a3a';
                    ctx.fillRect(px, py + 4, S, S - 4);
                    // Darker dirt patches
                    ctx.fillStyle = '#7a5a2a';
                    ctx.fillRect(px + 3, py + 10, 6, 4);
                    ctx.fillRect(px + 20, py + 18, 5, 4);
                    ctx.fillRect(px + 12, py + 24, 7, 3);
                    // Small rock pixels
                    ctx.fillStyle = '#9a8a6a';
                    ctx.fillRect(px + 8, py + 14, 2, 2);
                    ctx.fillRect(px + 24, py + 22, 2, 2);
                }
                break;
            }

            case 2: { // dirt
                ctx.fillStyle = '#8a6a3a';
                ctx.fillRect(px, py, S, S);
                // Darker patches
                ctx.fillStyle = '#7a5a2a';
                ctx.fillRect(px + 2, py + 4, 5, 4);
                ctx.fillRect(px + 16, py + 8, 6, 5);
                ctx.fillRect(px + 8, py + 20, 8, 4);
                // Small rocks
                ctx.fillStyle = '#9a8a6a';
                ctx.fillRect(px + 6, py + 12, 3, 2);
                ctx.fillRect(px + 22, py + 16, 2, 2);
                ctx.fillRect(px + 12, py + 2, 2, 2);
                // Very dark specks
                ctx.fillStyle = '#6a4a1a';
                ctx.fillRect(px + 28, py + 26, 2, 2);
                ctx.fillRect(px + 4, py + 28, 2, 2);
                break;
            }

            case 3: { // stone
                ctx.fillStyle = '#7a7a7a';
                ctx.fillRect(px, py, S, S);
                // Lighter highlights
                ctx.fillStyle = '#8a8a8a';
                ctx.fillRect(px + 2, py + 2, 10, 6);
                ctx.fillRect(px + 18, py + 16, 8, 5);
                // Cracks (dark lines)
                ctx.fillStyle = '#5a5a5a';
                ctx.fillRect(px + 14, py + 4, 1, 8);
                ctx.fillRect(px + 14, py + 10, 6, 1);
                ctx.fillRect(px + 6, py + 18, 1, 10);
                ctx.fillRect(px + 6, py + 22, 4, 1);
                // Dark specks
                ctx.fillStyle = '#6a6a6a';
                ctx.fillRect(px + 24, py + 6, 2, 2);
                ctx.fillRect(px + 4, py + 26, 2, 2);
                break;
            }

            case 4: { // stone brick
                ctx.fillStyle = '#5a5a5a';
                ctx.fillRect(px, py, S, S);
                // Brick pattern: 2 rows of bricks
                ctx.fillStyle = '#6a6a6a';
                // Top row
                ctx.fillRect(px + 1, py + 1, 14, 14);
                ctx.fillRect(px + 17, py + 1, 14, 14);
                // Bottom row (offset)
                ctx.fillRect(px - 7 + 1, py + 17, 14, 14);
                ctx.fillRect(px + 9, py + 17, 14, 14);
                ctx.fillRect(px + 25, py + 17, 6, 14);
                // Mortar lines are the background showing through
                // Highlight on bricks
                ctx.fillStyle = '#767676';
                ctx.fillRect(px + 2, py + 2, 12, 2);
                ctx.fillRect(px + 18, py + 2, 12, 2);
                ctx.fillRect(px + 10, py + 18, 12, 2);
                break;
            }

            case 5: { // wood platform
                // Only top 8px so player can jump through from below
                ctx.fillStyle = '#8a6832';
                ctx.fillRect(px, py, S, 8);
                // Plank lines
                ctx.fillStyle = '#7a5822';
                ctx.fillRect(px, py + 3, S, 1);
                ctx.fillRect(px + 10, py, 1, 8);
                ctx.fillRect(px + 22, py, 1, 8);
                // Wood grain highlights
                ctx.fillStyle = '#9a7842';
                ctx.fillRect(px + 2, py + 1, 6, 1);
                ctx.fillRect(px + 14, py + 5, 5, 1);
                // Nail dots
                ctx.fillStyle = '#555555';
                ctx.fillRect(px + 4, py + 4, 2, 2);
                ctx.fillRect(px + 15, py + 4, 2, 2);
                ctx.fillRect(px + 26, py + 4, 2, 2);
                break;
            }

            case 6: { // castle floor
                ctx.fillStyle = '#3a3050';
                ctx.fillRect(px, py, S, S);
                // Polished shine
                ctx.fillStyle = '#4a4060';
                ctx.fillRect(px + 2, py + 2, 12, 12);
                ctx.fillRect(px + 18, py + 18, 12, 12);
                // Subtle cracks
                ctx.fillStyle = '#302840';
                ctx.fillRect(px + 15, py, 1, S);
                ctx.fillRect(px, py + 15, S, 1);
                // Highlight edge
                ctx.fillStyle = '#5a5070';
                ctx.fillRect(px, py, S, 1);
                ctx.fillRect(px, py, 1, S);
                break;
            }

            case 7: { // spikes
                // Dark base
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(px, py + 24, S, 8);
                // Metallic spikes
                const spikeColor1 = '#aaaaaa';
                const spikeColor2 = '#cccccc';
                for (let i = 0; i < 4; i++) {
                    const sx = px + i * 8;
                    // Triangle spike
                    ctx.fillStyle = spikeColor1;
                    ctx.beginPath();
                    ctx.moveTo(sx + 4, py + 4);
                    ctx.lineTo(sx, py + 24);
                    ctx.lineTo(sx + 8, py + 24);
                    ctx.closePath();
                    ctx.fill();
                    // Highlight edge
                    ctx.fillStyle = spikeColor2;
                    ctx.beginPath();
                    ctx.moveTo(sx + 4, py + 4);
                    ctx.lineTo(sx + 2, py + 24);
                    ctx.lineTo(sx + 4, py + 24);
                    ctx.closePath();
                    ctx.fill();
                }
                // Red tips for danger
                ctx.fillStyle = '#cc3333';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(px + i * 8 + 3, py + 4, 2, 3);
                }
                break;
            }

            case 8: { // ice
                // Semi-transparent light blue
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#88ccee';
                ctx.fillRect(px, py, S, S);
                // Inner lighter area
                ctx.fillStyle = '#aaddff';
                ctx.fillRect(px + 4, py + 4, S - 8, S - 8);
                // Shine streak
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#ddeeff';
                ctx.fillRect(px + 4, py + 4, 8, 2);
                ctx.fillRect(px + 6, py + 6, 2, 6);
                // Sparkle
                const sparkle = 0.3 + 0.7 * ((Math.sin(t * 3 + px * 0.1) + 1) / 2);
                ctx.globalAlpha = sparkle * 0.8;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(px + 6, py + 6, 2, 2);
                ctx.globalAlpha = 1;
                break;
            }

            case 10: { // grass decoration
                // Small grass tufts on transparent background
                const grassGreen = theme === 'castle' ? '#4a5a38' : '#3a9a2a';
                const grassLight = theme === 'castle' ? '#5a6a48' : '#4aaa3a';
                ctx.fillStyle = grassGreen;
                // Blade 1
                ctx.fillRect(px + 8, py + 24, 2, 8);
                ctx.fillRect(px + 7, py + 22, 2, 4);
                // Blade 2
                ctx.fillStyle = grassLight;
                ctx.fillRect(px + 14, py + 22, 2, 10);
                ctx.fillRect(px + 15, py + 20, 2, 4);
                // Blade 3
                ctx.fillStyle = grassGreen;
                ctx.fillRect(px + 20, py + 25, 2, 7);
                ctx.fillRect(px + 21, py + 23, 2, 4);
                break;
            }

            case 11: { // flower decoration
                // Stem
                ctx.fillStyle = '#2a7a1a';
                ctx.fillRect(px + 15, py + 18, 2, 14);
                // Leaf
                ctx.fillStyle = '#3a9a2a';
                ctx.fillRect(px + 17, py + 24, 4, 2);
                ctx.fillRect(px + 19, py + 22, 2, 2);
                // Petals - color varies by position
                const flowerColors = ['#ff4466', '#ffaa22', '#ff66aa', '#44aaff', '#ffff44'];
                const ci = Math.abs(Math.floor(px * 0.1 + py * 0.07)) % flowerColors.length;
                ctx.fillStyle = flowerColors[ci];
                ctx.fillRect(px + 12, py + 14, 2, 4);
                ctx.fillRect(px + 18, py + 14, 2, 4);
                ctx.fillRect(px + 14, py + 12, 4, 2);
                ctx.fillRect(px + 14, py + 18, 4, 2);
                // Center
                ctx.fillStyle = '#ffee44';
                ctx.fillRect(px + 14, py + 14, 4, 4);
                break;
            }

            case 12: { // torch
                // Wall mount bracket
                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(px + 12, py + 14, 8, 4);
                ctx.fillRect(px + 14, py + 12, 4, 2);
                // Torch stick
                ctx.fillStyle = '#8a6a3a';
                ctx.fillRect(px + 14, py + 4, 4, 12);
                // Animated flame
                const flicker1 = Math.sin(t * 8 + px) * 0.3;
                const flicker2 = Math.sin(t * 12 + py) * 0.2;
                const flameH = 8 + Math.floor(flicker1 * 3);
                // Outer flame (orange/red)
                ctx.fillStyle = '#ff6622';
                ctx.fillRect(px + 13, py + 4 - flameH, 6, flameH);
                // Inner flame (yellow)
                ctx.fillStyle = '#ffcc22';
                ctx.fillRect(px + 14, py + 4 - flameH + 2, 4, flameH - 3);
                // Hot core (white-yellow)
                ctx.fillStyle = '#ffeeaa';
                ctx.fillRect(px + 15, py + 2, 2, 3);
                // Glow effect
                ctx.globalAlpha = 0.08 + 0.04 * flicker2;
                ctx.fillStyle = '#ff8833';
                const glowR = 24 + flicker1 * 8;
                ctx.beginPath();
                ctx.arc(px + 16, py + 4, glowR, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                break;
            }

            case 13: { // crystal
                const pulse = 0.6 + 0.4 * ((Math.sin(t * 2.5 + px * 0.1) + 1) / 2);
                // Glow aura
                ctx.globalAlpha = 0.1 * pulse;
                ctx.fillStyle = '#9944ff';
                ctx.beginPath();
                ctx.arc(px + 16, py + 16, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                // Crystal body
                ctx.fillStyle = '#7733cc';
                ctx.beginPath();
                ctx.moveTo(px + 16, py + 4);
                ctx.lineTo(px + 22, py + 14);
                ctx.lineTo(px + 20, py + 28);
                ctx.lineTo(px + 12, py + 28);
                ctx.lineTo(px + 10, py + 14);
                ctx.closePath();
                ctx.fill();
                // Highlight facet
                ctx.fillStyle = `rgba(170, 120, 255, ${0.5 + 0.3 * pulse})`;
                ctx.beginPath();
                ctx.moveTo(px + 16, py + 4);
                ctx.lineTo(px + 18, py + 14);
                ctx.lineTo(px + 16, py + 24);
                ctx.lineTo(px + 12, py + 14);
                ctx.closePath();
                ctx.fill();
                // Sparkle on top
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = pulse;
                ctx.fillRect(px + 15, py + 6, 2, 2);
                ctx.globalAlpha = 1;
                break;
            }

            case 16: { // dash-block brick - reinforced, blocks Shadow Dash
                // Dark purple reinforced stone
                ctx.fillStyle = '#2a1838';
                ctx.fillRect(px, py, S, S);
                // Brick pattern
                ctx.fillStyle = '#3a2848';
                ctx.fillRect(px + 1, py + 1, 14, 14);
                ctx.fillRect(px + 17, py + 1, 14, 14);
                ctx.fillRect(px + 9, py + 17, 14, 14);
                ctx.fillRect(px - 7, py + 17, 14, 14);
                ctx.fillRect(px + 25, py + 17, 6, 14);
                // Iron bands
                ctx.fillStyle = '#555566';
                ctx.fillRect(px, py + 15, S, 2);
                ctx.fillRect(px + 15, py, 2, S);
                // Glowing rune marks
                const runePulse = 0.4 + 0.3 * Math.sin(t * 2 + px * 0.05);
                ctx.globalAlpha = runePulse;
                ctx.fillStyle = '#8844cc';
                ctx.fillRect(px + 6, py + 6, 4, 1);
                ctx.fillRect(px + 7, py + 5, 2, 3);
                ctx.fillRect(px + 22, py + 22, 4, 1);
                ctx.fillRect(px + 23, py + 21, 2, 3);
                ctx.globalAlpha = 1;
                // Corner rivets
                ctx.fillStyle = '#777788';
                ctx.fillRect(px + 1, py + 1, 2, 2);
                ctx.fillRect(px + S - 3, py + 1, 2, 2);
                ctx.fillRect(px + 1, py + S - 3, 2, 2);
                ctx.fillRect(px + S - 3, py + S - 3, 2, 2);
                break;
            }

            case 15: { // rock / boulder
                // Large rounded rock obstacle
                ctx.fillStyle = '#6a6a6a';
                ctx.beginPath();
                ctx.moveTo(px + 4, py + S);
                ctx.lineTo(px + 2, py + 20);
                ctx.lineTo(px + 4, py + 10);
                ctx.lineTo(px + 10, py + 4);
                ctx.lineTo(px + 20, py + 2);
                ctx.lineTo(px + 28, py + 6);
                ctx.lineTo(px + 30, py + 16);
                ctx.lineTo(px + 28, py + S);
                ctx.closePath();
                ctx.fill();
                // Highlight
                ctx.fillStyle = '#7a7a7a';
                ctx.beginPath();
                ctx.moveTo(px + 10, py + 6);
                ctx.lineTo(px + 20, py + 4);
                ctx.lineTo(px + 26, py + 8);
                ctx.lineTo(px + 24, py + 14);
                ctx.lineTo(px + 14, py + 12);
                ctx.closePath();
                ctx.fill();
                // Dark cracks
                ctx.fillStyle = '#5a5a5a';
                ctx.fillRect(px + 12, py + 14, 1, 6);
                ctx.fillRect(px + 12, py + 18, 4, 1);
                ctx.fillRect(px + 22, py + 10, 1, 8);
                // Moss patches
                if (theme === 'forest') {
                    ctx.fillStyle = '#3a6a2a';
                    ctx.fillRect(px + 6, py + 8, 3, 2);
                    ctx.fillRect(px + 24, py + 12, 4, 2);
                    ctx.fillRect(px + 14, py + 20, 3, 2);
                }
                // Dark base shadow
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(px + 2, py + S - 2, 28, 2);
                break;
            }

            case 14: { // exit portal
                const cx = px + 16;
                const cy = py + 16;
                // Outer glow
                ctx.globalAlpha = 0.15 + 0.05 * Math.sin(t * 2);
                const portalGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 22);
                portalGlow.addColorStop(0, '#8844ff');
                portalGlow.addColorStop(0.5, '#4422cc');
                portalGlow.addColorStop(1, 'rgba(40, 10, 80, 0)');
                ctx.fillStyle = portalGlow;
                ctx.fillRect(px - 6, py - 6, S + 12, S + 12);
                ctx.globalAlpha = 1;

                // Swirling ring
                ctx.strokeStyle = '#7744ee';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(cx, cy, 12, 0, Math.PI * 2);
                ctx.stroke();

                // Inner swirl
                ctx.strokeStyle = '#aa66ff';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    const angle = t * 3 + (Math.PI * 2 / 3) * i;
                    const r = 8;
                    ctx.beginPath();
                    ctx.arc(
                        cx + Math.cos(angle) * 4,
                        cy + Math.sin(angle) * 4,
                        4, 0, Math.PI * 2
                    );
                    ctx.stroke();
                }

                // Center bright spot
                ctx.fillStyle = '#ccaaff';
                ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4);
                ctx.beginPath();
                ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Orbiting particles
                for (let i = 0; i < 6; i++) {
                    const pAngle = t * 2.5 + (Math.PI * 2 / 6) * i;
                    const pr = 10 + 3 * Math.sin(t * 3 + i);
                    const ppx = cx + Math.cos(pAngle) * pr;
                    const ppy = cy + Math.sin(pAngle) * pr;
                    ctx.fillStyle = i % 2 === 0 ? '#aa88ff' : '#6644cc';
                    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 5 + i * 2);
                    ctx.fillRect(Math.floor(ppx), Math.floor(ppy), 2, 2);
                }
                ctx.globalAlpha = 1;
                ctx.lineWidth = 1;
                break;
            }
        }
    },

    // =========================================================================
    // drawPlayer
    // =========================================================================
    drawPlayer(ctx, player, camera) {
        // Invincibility flashing - skip every other frame
        if (player.invincibleTimer > 0) {
            if (Math.floor(player.invincibleTimer * 10) % 2 === 0) return;
        }

        const sx = Math.floor(Camera.screenX(player.x));
        const sy = Math.floor(Camera.screenY(player.y));
        const W = player.width;  // 20
        const H = player.height; // 30
        const t = player.animTimer;
        const state = player.animState;

        ctx.save();

        // Dash afterimage effect
        if (player.dashing) {
            // Draw 3 trailing afterimages
            for (let i = 3; i >= 1; i--) {
                ctx.globalAlpha = 0.12 * i;
                const trailOff = player.facing * i * 12;
                this._drawPlayerBody(ctx, sx - trailOff, sy, W, H, state, t, player.facing);
            }
            ctx.globalAlpha = 0.7;
        }

        // Handle facing direction
        this._drawPlayerBody(ctx, sx, sy, W, H, state, t, player.facing);

        ctx.restore();
    },

    _drawPlayerBody(ctx, sx, sy, W, H, state, t, facing) {
        ctx.save();

        // Flip for left-facing
        if (facing === -1) {
            ctx.translate(sx + W, sy);
            ctx.scale(-1, 1);
            ctx.translate(0, 0);
        } else {
            ctx.translate(sx, sy);
        }

        const bodyColor = '#4477CC';
        const darkBody = '#335599';
        const silver = '#AABBCC';
        const darkFace = '#1a1a2e';
        const skinShadow = '#0e0e1e';

        // Animation offsets
        let bodyBob = 0;
        let legOffset1 = 0;
        let legOffset2 = 0;
        let armX = 0;
        let armY = 0;
        let cloakFlutter = 0;

        if (state === 'idle') {
            bodyBob = Math.sin(t * 2.5) * 1;
        } else if (state === 'run') {
            bodyBob = Math.abs(Math.sin(t * 10)) * 2;
            legOffset1 = Math.sin(t * 10) * 4;
            legOffset2 = Math.sin(t * 10 + Math.PI) * 4;
            cloakFlutter = Math.sin(t * 10) * 2;
        } else if (state === 'jump') {
            bodyBob = -2;
        } else if (state === 'fall') {
            bodyBob = 1;
            cloakFlutter = 2;
        } else if (state === 'dash') {
            bodyBob = 0;
        }

        const bob = Math.floor(bodyBob);

        // --- CLOAK / BODY ---
        // Main body robe
        ctx.fillStyle = bodyColor;
        if (state === 'dash') {
            // Stretched horizontal during dash
            ctx.fillRect(0, 8 + bob, W, 14);
            // Hood
            ctx.fillRect(W - 6, 4 + bob, 8, 10);
        } else {
            // Body
            ctx.fillRect(4, 8 + bob, 12, 16);
            // Cloak sides flowing
            ctx.fillRect(2, 10 + bob, 3, 12 + Math.floor(cloakFlutter));
            ctx.fillRect(15, 10 + bob, 3, 12 + Math.floor(cloakFlutter));
        }

        // --- HOOD ---
        if (state !== 'dash') {
            ctx.fillStyle = bodyColor;
            ctx.fillRect(4, 2 + bob, 12, 10);
            // Hood top
            ctx.fillRect(6, 0 + bob, 8, 4);
            // Hood point/peak
            ctx.fillStyle = darkBody;
            ctx.fillRect(5, 2 + bob, 2, 4);
            ctx.fillRect(14, 2 + bob, 2, 4);

            // Silver trim on hood
            ctx.fillStyle = silver;
            ctx.fillRect(6, 0 + bob, 8, 1);
            ctx.fillRect(4, 2 + bob, 1, 6);
            ctx.fillRect(16, 2 + bob, 1, 6);

            // Face area (dark)
            ctx.fillStyle = darkFace;
            ctx.fillRect(6, 4 + bob, 8, 6);

            // Eyes (two white dots)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(8, 6 + bob, 2, 2);
            ctx.fillRect(12, 6 + bob, 2, 2);

            // Eye pupils
            ctx.fillStyle = '#88ccff';
            ctx.fillRect(9, 7 + bob, 1, 1);
            ctx.fillRect(13, 7 + bob, 1, 1);
        }

        // --- SILVER BELT ---
        if (state !== 'dash') {
            ctx.fillStyle = silver;
            ctx.fillRect(4, 16 + bob, 12, 2);
            // Belt buckle
            ctx.fillStyle = '#ddeeff';
            ctx.fillRect(8, 16 + bob, 4, 2);
        }

        // --- LEGS ---
        if (state === 'dash') {
            // Legs stretched behind
            ctx.fillStyle = darkBody;
            ctx.fillRect(-4, 12 + bob, 6, 4);
            ctx.fillRect(-8, 14 + bob, 6, 4);
        } else if (state === 'jump') {
            // Legs tucked
            ctx.fillStyle = darkBody;
            ctx.fillRect(4, 24 + bob, 5, 4);
            ctx.fillRect(11, 24 + bob, 5, 4);
        } else {
            // Normal or running legs
            ctx.fillStyle = darkBody;
            ctx.fillRect(5, 24 + bob + Math.floor(legOffset1), 4, 6);
            ctx.fillRect(11, 24 + bob + Math.floor(legOffset2), 4, 6);
            // Feet
            ctx.fillStyle = '#2a2a44';
            ctx.fillRect(5, 28 + bob + Math.floor(legOffset1), 5, 2);
            ctx.fillRect(11, 28 + bob + Math.floor(legOffset2), 5, 2);
        }

        // --- ARMS ---
        if (state === 'attack' || state === 'cast') {
            if (state === 'attack') {
                // Arm extended forward for throwing
                ctx.fillStyle = bodyColor;
                ctx.fillRect(16, 10 + bob, 6, 4);
                // Hand
                ctx.fillStyle = darkFace;
                ctx.fillRect(20, 10 + bob, 3, 3);
            } else {
                // Cast: both hands raised with glow
                ctx.fillStyle = bodyColor;
                // Left arm up
                ctx.fillRect(0, 6 + bob, 4, 4);
                // Right arm up
                ctx.fillRect(16, 6 + bob, 4, 4);
                // Hands
                ctx.fillStyle = darkFace;
                ctx.fillRect(0, 4 + bob, 3, 3);
                ctx.fillRect(17, 4 + bob, 3, 3);
                // Magic glow between hands
                const glowPulse = 0.5 + 0.5 * Math.sin(t * 8);
                ctx.globalAlpha = 0.3 + 0.4 * glowPulse;
                ctx.fillStyle = '#66aaff';
                ctx.fillRect(6, 2 + bob, 8, 6);
                ctx.fillStyle = '#aaddff';
                ctx.fillRect(8, 3 + bob, 4, 4);
                ctx.globalAlpha = 1;
            }
        } else if (state === 'dash') {
            // Arms trailing
            ctx.fillStyle = bodyColor;
            ctx.fillRect(-2, 8 + bob, 4, 4);
        } else {
            // Default arm positions (at sides)
            ctx.fillStyle = darkBody;
            if (state === 'run') {
                // Swinging arms
                const armSwing = Math.sin(t * 10) * 3;
                ctx.fillRect(1, 12 + bob + Math.floor(armSwing), 3, 6);
                ctx.fillRect(16, 12 + bob - Math.floor(armSwing), 3, 6);
            } else if (state === 'jump') {
                // Arms raised
                ctx.fillRect(1, 6 + bob, 3, 6);
                ctx.fillRect(16, 6 + bob, 3, 6);
            } else {
                // Idle arms at side
                ctx.fillRect(1, 12 + bob, 3, 8);
                ctx.fillRect(16, 12 + bob, 3, 8);
            }
        }

        ctx.restore();
    },

    // =========================================================================
    // drawEnemy
    // =========================================================================
    drawEnemy(ctx, enemy, camera) {
        if (!Camera.isVisible(enemy.x, enemy.y, enemy.width, enemy.height)) return;

        const sx = Math.floor(Camera.screenX(enemy.x));
        const sy = Math.floor(Camera.screenY(enemy.y));
        const t = enemy.animTimer || 0;
        const facing = enemy.facing || 1;

        ctx.save();

        // Death animation: shrink and fade
        if (enemy.dead) {
            const maxDeath = enemy.type === 'shadowKing' ? 3 : 0.5;
            const deathProgress = Math.min((enemy.deathTimer || 0) / maxDeath, 1);
            ctx.globalAlpha = 1 - deathProgress;
            const scale = 1 - deathProgress * 0.5;
            ctx.translate(sx + enemy.width / 2, sy + enemy.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-enemy.width / 2, -enemy.height / 2);
            this._drawEnemyType(ctx, enemy.type, 0, 0, enemy.width, enemy.height, t, facing);
            ctx.restore();
            return;
        }

        // Frozen overlay
        if (enemy.frozen) {
            // Draw enemy with blue tint
            this._drawEnemyType(ctx, enemy.type, sx, sy, enemy.width, enemy.height, 0, facing);
            // Ice overlay
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#88ccff';
            ctx.fillRect(sx - 1, sy - 1, enemy.width + 2, enemy.height + 2);
            // Ice crystals on edges
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#aaeeff';
            ctx.fillRect(sx - 2, sy, 2, 4);
            ctx.fillRect(sx + enemy.width, sy + 4, 2, 4);
            ctx.fillRect(sx + 4, sy - 2, 4, 2);
            ctx.globalAlpha = 1;
        } else {
            this._drawEnemyType(ctx, enemy.type, sx, sy, enemy.width, enemy.height, t, facing);
        }

        // Confused: spinning stars above head
        if (enemy.confused) {
            const starT = Date.now() / 1000;
            for (let i = 0; i < 3; i++) {
                const angle = starT * 3 + (Math.PI * 2 / 3) * i;
                const starX = sx + enemy.width / 2 + Math.cos(angle) * 10;
                const starY = sy - 8 + Math.sin(angle * 0.7) * 3;
                ctx.fillStyle = '#ffff44';
                ctx.fillRect(Math.floor(starX) - 1, Math.floor(starY), 3, 1);
                ctx.fillRect(Math.floor(starX), Math.floor(starY) - 1, 1, 3);
            }
        }

        ctx.restore();
    },

    _drawEnemyType(ctx, type, x, y, w, h, t, facing) {
        ctx.save();

        // Handle facing
        if (facing === -1) {
            ctx.translate(x + w, y);
            ctx.scale(-1, 1);
            x = 0;
            y = 0;
        } else {
            ctx.translate(x, y);
            x = 0;
            y = 0;
        }

        switch (type) {
            case 'wolf': {
                // 28x20 dark grey wolf
                // Body
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(4, 6, 18, 10);
                // Hunched back
                ctx.fillRect(6, 4, 12, 4);
                // Head
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(20, 2, 8, 8);
                // Snout
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(26, 4, 4, 4);
                // Pointy ears
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(22, 0, 2, 3);
                ctx.fillRect(26, 0, 2, 3);
                // Inner ear
                ctx.fillStyle = '#5a3a3a';
                ctx.fillRect(22, 1, 1, 2);
                ctx.fillRect(26, 1, 1, 2);
                // Red eyes
                ctx.fillStyle = '#ff2222';
                ctx.fillRect(24, 4, 2, 2);
                // Nose
                ctx.fillStyle = '#222222';
                ctx.fillRect(28, 5, 2, 2);
                // Teeth
                ctx.fillStyle = '#dddddd';
                ctx.fillRect(26, 8, 1, 2);
                ctx.fillRect(28, 8, 1, 2);
                // Legs (animated)
                ctx.fillStyle = '#3a3a3a';
                const wolfLeg = Math.sin(t * 8) * 2;
                // Front legs
                ctx.fillRect(18, 16, 3, 4 + Math.floor(wolfLeg));
                ctx.fillRect(22, 16, 3, 4 - Math.floor(wolfLeg));
                // Back legs
                ctx.fillRect(6, 16, 3, 4 - Math.floor(wolfLeg));
                ctx.fillRect(10, 16, 3, 4 + Math.floor(wolfLeg));
                // Tail
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(0, 4, 5, 3);
                ctx.fillRect(-1, 2 + Math.floor(Math.sin(t * 4) * 2), 3, 3);
                // Belly lighter
                ctx.fillStyle = '#5a5a5a';
                ctx.fillRect(8, 14, 12, 2);
                break;
            }

            case 'bat': {
                // 24x16 purple bat
                const flapY = Math.sin(t * 12) * 4;
                const flapAngle = Math.sin(t * 12) * 0.3;
                // Body
                ctx.fillStyle = '#4a2266';
                ctx.fillRect(9, 4, 6, 8);
                // Head
                ctx.fillStyle = '#5a3377';
                ctx.fillRect(10, 2, 4, 4);
                // Ears
                ctx.fillRect(9, 0, 2, 3);
                ctx.fillRect(13, 0, 2, 3);
                // Eyes
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(10, 3, 1, 1);
                ctx.fillRect(13, 3, 1, 1);
                // Left wing
                ctx.fillStyle = '#3a1a55';
                ctx.fillRect(0, 4 + Math.floor(flapY), 9, 3);
                ctx.fillRect(2, 6 + Math.floor(flapY * 0.7), 7, 3);
                ctx.fillStyle = '#4a2266';
                ctx.fillRect(1, 5 + Math.floor(flapY), 8, 2);
                // Right wing
                ctx.fillStyle = '#3a1a55';
                ctx.fillRect(15, 4 + Math.floor(flapY), 9, 3);
                ctx.fillRect(15, 6 + Math.floor(flapY * 0.7), 7, 3);
                ctx.fillStyle = '#4a2266';
                ctx.fillRect(15, 5 + Math.floor(flapY), 8, 2);
                // Fangs
                ctx.fillStyle = '#dddddd';
                ctx.fillRect(11, 6, 1, 2);
                ctx.fillRect(12, 6, 1, 2);
                // Feet
                ctx.fillStyle = '#3a1a55';
                ctx.fillRect(10, 12, 1, 2);
                ctx.fillRect(13, 12, 1, 2);
                break;
            }

            case 'spider': {
                // 24x18 dark brown spider
                // Body (two segments)
                ctx.fillStyle = '#3a2a1a';
                ctx.fillRect(8, 4, 8, 8); // cephalothorax
                ctx.fillStyle = '#2a1a0a';
                ctx.fillRect(6, 8, 12, 8); // abdomen
                // Pattern on abdomen
                ctx.fillStyle = '#4a3a2a';
                ctx.fillRect(10, 10, 4, 2);
                ctx.fillRect(9, 12, 6, 2);
                // Multiple red eyes (4 pairs)
                ctx.fillStyle = '#ff2222';
                ctx.fillRect(10, 4, 1, 1);
                ctx.fillRect(13, 4, 1, 1);
                ctx.fillStyle = '#cc1111';
                ctx.fillRect(9, 5, 1, 1);
                ctx.fillRect(14, 5, 1, 1);
                ctx.fillRect(10, 6, 1, 1);
                ctx.fillRect(13, 6, 1, 1);
                ctx.fillStyle = '#881111';
                ctx.fillRect(11, 5, 1, 1);
                ctx.fillRect(12, 5, 1, 1);
                // 8 legs (animated)
                ctx.fillStyle = '#3a2a1a';
                const legAnim = Math.sin(t * 8) * 2;
                // Left legs
                for (let i = 0; i < 4; i++) {
                    const legY = 6 + i * 3;
                    const la = Math.sin(t * 8 + i * 1.2) * 2;
                    ctx.fillRect(8 - 5 - Math.floor(Math.abs(la)), legY + Math.floor(la), 6, 1);
                    ctx.fillRect(8 - 6 - Math.floor(Math.abs(la)), legY + Math.floor(la) + 1, 2, 2);
                }
                // Right legs
                for (let i = 0; i < 4; i++) {
                    const legY = 6 + i * 3;
                    const la = Math.sin(t * 8 + i * 1.2 + Math.PI) * 2;
                    ctx.fillRect(16 + Math.floor(Math.abs(la)), legY + Math.floor(la), 6, 1);
                    ctx.fillRect(20 + Math.floor(Math.abs(la)), legY + Math.floor(la) + 1, 2, 2);
                }
                // Mandibles
                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(9, 7, 2, 2);
                ctx.fillRect(13, 7, 2, 2);
                break;
            }

            case 'shadowSoldier': {
                // 22x32 dark humanoid
                const sway = Math.sin(t * 3) * 1;
                // Body
                ctx.fillStyle = '#1a0a2a';
                ctx.fillRect(4, 8, 14, 14);
                // Darker center
                ctx.fillStyle = '#120822';
                ctx.fillRect(6, 10, 10, 10);
                // Head
                ctx.fillStyle = '#2a1a3a';
                ctx.fillRect(6, 0, 10, 10);
                // Helmet
                ctx.fillStyle = '#1a0a2a';
                ctx.fillRect(5, 0, 12, 4);
                ctx.fillRect(4, 2, 14, 2);
                // Glowing red eyes
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(8, 4, 2, 2);
                ctx.fillRect(13, 4, 2, 2);
                // Eye glow
                ctx.globalAlpha = 0.2 + 0.1 * Math.sin(t * 4);
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(7, 3, 4, 4);
                ctx.fillRect(12, 3, 4, 4);
                ctx.globalAlpha = 1;
                // Legs
                ctx.fillStyle = '#1a0a2a';
                const soldierLeg = Math.sin(t * 5) * 2;
                ctx.fillRect(5, 22, 5, 8 + Math.floor(soldierLeg));
                ctx.fillRect(12, 22, 5, 8 - Math.floor(soldierLeg));
                // Boots
                ctx.fillStyle = '#100820';
                ctx.fillRect(4, 28 + Math.floor(soldierLeg), 6, 3);
                ctx.fillRect(12, 28 - Math.floor(soldierLeg), 6, 3);
                // Sword arm (right side)
                ctx.fillStyle = '#1a0a2a';
                ctx.fillRect(18, 10 + Math.floor(sway), 4, 10);
                // Sword blade
                ctx.fillStyle = '#2a1a3a';
                ctx.fillRect(19, 2 + Math.floor(sway), 2, 10);
                // Sword edge highlight
                ctx.fillStyle = '#4a2a5a';
                ctx.fillRect(20, 3 + Math.floor(sway), 1, 8);
                // Shield arm
                ctx.fillStyle = '#1a0a2a';
                ctx.fillRect(0, 10 + Math.floor(-sway), 4, 8);
                // Dark energy wisps
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#6622aa';
                const wispY = Math.sin(t * 5) * 3;
                ctx.fillRect(2, 6 + Math.floor(wispY), 2, 2);
                ctx.fillRect(18, 20 - Math.floor(wispY), 2, 2);
                ctx.globalAlpha = 1;
                break;
            }

            case 'skeletonMage': {
                // 20x32 skeleton with purple robe
                const bob = Math.sin(t * 2) * 1;
                // Purple robe body
                ctx.fillStyle = '#5522aa';
                ctx.fillRect(3, 12 + Math.floor(bob), 14, 14);
                // Robe bottom flare
                ctx.fillRect(1, 22 + Math.floor(bob), 18, 6);
                // Robe highlights
                ctx.fillStyle = '#6633bb';
                ctx.fillRect(5, 14 + Math.floor(bob), 4, 8);
                // Skull head
                ctx.fillStyle = '#ddddcc';
                ctx.fillRect(5, 0 + Math.floor(bob), 10, 10);
                // Skull details
                ctx.fillStyle = '#ccccbb';
                ctx.fillRect(6, 1 + Math.floor(bob), 8, 8);
                // Eye sockets
                ctx.fillStyle = '#220044';
                ctx.fillRect(7, 3 + Math.floor(bob), 2, 3);
                ctx.fillRect(11, 3 + Math.floor(bob), 2, 3);
                // Glowing eyes in sockets
                ctx.fillStyle = '#aa44ff';
                ctx.fillRect(7, 4 + Math.floor(bob), 2, 2);
                ctx.fillRect(11, 4 + Math.floor(bob), 2, 2);
                // Nose hole
                ctx.fillStyle = '#220044';
                ctx.fillRect(9, 6 + Math.floor(bob), 2, 2);
                // Jaw/teeth
                ctx.fillStyle = '#ccccbb';
                ctx.fillRect(7, 8 + Math.floor(bob), 6, 2);
                ctx.fillStyle = '#220044';
                ctx.fillRect(8, 8 + Math.floor(bob), 1, 2);
                ctx.fillRect(10, 8 + Math.floor(bob), 1, 2);
                ctx.fillRect(12, 8 + Math.floor(bob), 1, 2);
                // Hood over skull
                ctx.fillStyle = '#3a1188';
                ctx.fillRect(4, 0 + Math.floor(bob), 2, 6);
                ctx.fillRect(14, 0 + Math.floor(bob), 2, 6);
                ctx.fillRect(4, -1 + Math.floor(bob), 12, 2);
                // Bone arms
                ctx.fillStyle = '#ccccbb';
                // Left arm
                ctx.fillRect(0, 14 + Math.floor(bob), 3, 2);
                ctx.fillRect(0, 14 + Math.floor(bob), 2, 8);
                // Staff arm (right)
                ctx.fillRect(17, 14 + Math.floor(bob), 3, 2);
                ctx.fillRect(18, 14 + Math.floor(bob), 2, 8);
                // Staff
                ctx.fillStyle = '#8844aa';
                ctx.fillRect(19, 2 + Math.floor(bob), 2, 24);
                // Staff orb (glowing)
                const orbPulse = 0.5 + 0.5 * Math.sin(t * 4);
                ctx.globalAlpha = 0.3 * orbPulse;
                ctx.fillStyle = '#aa66ff';
                ctx.fillRect(16, -2 + Math.floor(bob), 8, 8);
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#cc88ff';
                ctx.fillRect(18, 0 + Math.floor(bob), 4, 4);
                ctx.fillStyle = '#eeccff';
                ctx.fillRect(19, 1 + Math.floor(bob), 2, 2);
                // Bone feet
                ctx.fillStyle = '#ccccbb';
                ctx.fillRect(4, 28 + Math.floor(bob), 4, 2);
                ctx.fillRect(12, 28 + Math.floor(bob), 4, 2);
                break;
            }

            case 'shadowKing': {
                // 40x56 large dark king made of shadows
                const bob = Math.sin(t * 2) * 3;
                const auraFlicker = Math.sin(t * 5) * 0.15 + 0.85;

                // Dark aura glow
                ctx.globalAlpha = 0.2 * auraFlicker;
                ctx.fillStyle = '#6600AA';
                ctx.fillRect(-4, -4 + Math.floor(bob), w + 8, h + 8);
                ctx.globalAlpha = 1;

                // Shadowy body / robe
                ctx.fillStyle = '#1a0033';
                ctx.fillRect(8, 14 + Math.floor(bob), 24, 38);
                // Robe bottom flare
                ctx.fillRect(4, 40 + Math.floor(bob), 32, 14);
                // Robe edges
                ctx.fillStyle = '#2a0055';
                ctx.fillRect(6, 16 + Math.floor(bob), 4, 36);
                ctx.fillRect(30, 16 + Math.floor(bob), 4, 36);

                // Shoulders / pauldrons
                ctx.fillStyle = '#330066';
                ctx.fillRect(4, 14 + Math.floor(bob), 10, 8);
                ctx.fillRect(26, 14 + Math.floor(bob), 10, 8);
                // Pauldron spikes
                ctx.fillStyle = '#4400AA';
                ctx.fillRect(4, 12 + Math.floor(bob), 4, 4);
                ctx.fillRect(32, 12 + Math.floor(bob), 4, 4);

                // Head / hood
                ctx.fillStyle = '#220044';
                ctx.fillRect(12, 2 + Math.floor(bob), 16, 14);
                // Hood point
                ctx.fillRect(16, 0 + Math.floor(bob), 8, 4);

                // Crown
                ctx.fillStyle = '#8800CC';
                ctx.fillRect(12, 2 + Math.floor(bob), 16, 3);
                ctx.fillRect(12, 0 + Math.floor(bob), 3, 4);
                ctx.fillRect(18, -1 + Math.floor(bob), 3, 4);
                ctx.fillRect(25, 0 + Math.floor(bob), 3, 4);

                // Glowing red eyes
                ctx.fillStyle = '#FF0000';
                const eyeGlow = Math.sin(t * 3) * 0.2 + 0.8;
                ctx.globalAlpha = eyeGlow;
                ctx.fillRect(15, 8 + Math.floor(bob), 4, 3);
                ctx.fillRect(21, 8 + Math.floor(bob), 4, 3);
                // Eye core
                ctx.fillStyle = '#FF4444';
                ctx.fillRect(16, 9 + Math.floor(bob), 2, 1);
                ctx.fillRect(22, 9 + Math.floor(bob), 2, 1);
                ctx.globalAlpha = 1;

                // Shadow tendrils at bottom
                ctx.fillStyle = '#110022';
                for (let i = 0; i < 4; i++) {
                    const tx = 6 + i * 8;
                    const tendrilLen = 4 + Math.sin(t * 3 + i * 1.5) * 3;
                    ctx.fillRect(tx, 52 + Math.floor(bob), 4, Math.floor(tendrilLen));
                }

                // Hands / claws
                ctx.fillStyle = '#2a0055';
                ctx.fillRect(0, 26 + Math.floor(bob), 6, 6);
                ctx.fillRect(34, 26 + Math.floor(bob), 6, 6);
                // Claws
                ctx.fillStyle = '#8800CC';
                ctx.fillRect(0, 32 + Math.floor(bob), 2, 3);
                ctx.fillRect(3, 32 + Math.floor(bob), 2, 3);
                ctx.fillRect(36, 32 + Math.floor(bob), 2, 3);
                ctx.fillRect(39, 32 + Math.floor(bob), 2, 3);

                break;
            }
        }

        ctx.restore();
    },

    // =========================================================================
    // drawProjectile
    // =========================================================================
    drawProjectile(ctx, proj, camera) {
        const sx = Math.floor(Camera.screenX(proj.x));
        const sy = Math.floor(Camera.screenY(proj.y));
        const t = Date.now() / 1000;

        ctx.save();

        switch (proj.type) {
            case 'ninjastar': {
                // Spinning 4-pointed star
                const cx = sx + proj.width / 2;
                const cy = sy + proj.height / 2;
                const angle = t * 15; // fast spin
                const r = proj.width / 2;

                ctx.translate(cx, cy);
                ctx.rotate(angle);

                // 4 points of the star
                ctx.fillStyle = '#cccccc';
                ctx.fillRect(-r, -1, r * 2, 2);
                ctx.fillRect(-1, -r, 2, r * 2);

                // Diagonal cross
                ctx.fillStyle = '#aaaaaa';
                ctx.save();
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-r + 1, -1, r * 2 - 2, 2);
                ctx.fillRect(-1, -r + 1, 2, r * 2 - 2);
                ctx.restore();

                // Center dot
                ctx.fillStyle = '#eeeeee';
                ctx.fillRect(-1, -1, 2, 2);

                break;
            }

            case 'fireball': {
                // Glowing orange/red circle with trail
                const cx = sx + proj.width / 2;
                const cy = sy + proj.height / 2;
                const pulse = 0.8 + 0.2 * Math.sin(t * 10);

                // Trailing particles
                for (let i = 1; i <= 3; i++) {
                    ctx.globalAlpha = 0.3 / i;
                    ctx.fillStyle = '#ff6622';
                    const trailDir = proj.vx > 0 ? -1 : 1;
                    ctx.fillRect(
                        Math.floor(cx - 3 + trailDir * i * 5),
                        Math.floor(cy - 2 + Math.sin(t * 12 + i) * 2),
                        4, 4
                    );
                }
                ctx.globalAlpha = 1;

                // Outer glow
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#ff4400';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 2 + 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Core
                ctx.fillStyle = '#ff6622';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 2 * pulse, 0, Math.PI * 2);
                ctx.fill();

                // Hot center
                ctx.fillStyle = '#ffcc44';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 4, 0, Math.PI * 2);
                ctx.fill();

                // Bright spot
                ctx.fillStyle = '#ffeeaa';
                ctx.fillRect(Math.floor(cx - 1), Math.floor(cy - 1), 2, 2);
                break;
            }

            case 'iceblast': {
                // Light blue crystal shard
                const cx = sx + proj.width / 2;
                const cy = sy + proj.height / 2;
                const dir = (proj.vx || 0) > 0 ? 1 : -1;

                // Glow
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#88ddff';
                ctx.fillRect(sx - 2, sy - 2, proj.width + 4, proj.height + 4);
                ctx.globalAlpha = 1;

                // Shard shape
                ctx.fillStyle = '#66ccee';
                ctx.beginPath();
                ctx.moveTo(cx + dir * proj.width / 2, cy);
                ctx.lineTo(cx, cy - proj.height / 2);
                ctx.lineTo(cx - dir * proj.width / 2, cy);
                ctx.lineTo(cx, cy + proj.height / 2);
                ctx.closePath();
                ctx.fill();

                // Inner highlight
                ctx.fillStyle = '#aaeeff';
                ctx.beginPath();
                ctx.moveTo(cx + dir * 2, cy);
                ctx.lineTo(cx, cy - 2);
                ctx.lineTo(cx - dir * 2, cy);
                ctx.lineTo(cx, cy + 2);
                ctx.closePath();
                ctx.fill();

                // Sparkle
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(Math.floor(cx), Math.floor(cy - 1), 1, 1);
                break;
            }

            case 'shadowbolt': {
                // Dark purple bolt
                const cx = sx + proj.width / 2;
                const cy = sy + proj.height / 2;

                // Dark aura
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = '#330066';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 2 + 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Core
                ctx.fillStyle = '#6622aa';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
                ctx.fill();

                // Inner
                ctx.fillStyle = '#9944dd';
                ctx.fillRect(Math.floor(cx - 2), Math.floor(cy - 2), 4, 4);

                // Bright center
                ctx.fillStyle = '#cc88ff';
                ctx.fillRect(Math.floor(cx - 1), Math.floor(cy - 1), 2, 2);

                // Trailing wisps
                for (let i = 1; i <= 2; i++) {
                    ctx.globalAlpha = 0.2 / i;
                    ctx.fillStyle = '#6622aa';
                    const trailDir = (proj.vx || 0) > 0 ? -1 : 1;
                    ctx.fillRect(
                        Math.floor(cx + trailDir * i * 6),
                        Math.floor(cy - 1 + Math.sin(t * 10 + i * 2) * 3),
                        3, 3
                    );
                }
                ctx.globalAlpha = 1;
                break;
            }

            case 'skullfire': {
                // Green flame skull
                const cx = sx + proj.width / 2;
                const cy = sy + proj.height / 2;

                // Green flame aura
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#22aa22';
                ctx.beginPath();
                ctx.arc(cx, cy, proj.width / 2 + 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Flame behind skull
                const flameH = 4 + Math.sin(t * 10) * 2;
                ctx.fillStyle = '#22cc22';
                ctx.fillRect(Math.floor(cx - 3), Math.floor(cy - proj.height / 2 - flameH), 6, Math.floor(flameH + 2));
                ctx.fillStyle = '#88ff88';
                ctx.fillRect(Math.floor(cx - 1), Math.floor(cy - proj.height / 2 - flameH + 1), 2, Math.floor(flameH));

                // Skull
                ctx.fillStyle = '#ccccbb';
                ctx.fillRect(Math.floor(cx - 4), Math.floor(cy - 4), 8, 8);
                // Eye sockets
                ctx.fillStyle = '#22cc22';
                ctx.fillRect(Math.floor(cx - 3), Math.floor(cy - 2), 2, 2);
                ctx.fillRect(Math.floor(cx + 1), Math.floor(cy - 2), 2, 2);
                // Nose
                ctx.fillStyle = '#aa9988';
                ctx.fillRect(Math.floor(cx - 1), Math.floor(cy + 1), 2, 1);
                // Jaw
                ctx.fillStyle = '#bbbbaa';
                ctx.fillRect(Math.floor(cx - 3), Math.floor(cy + 3), 6, 2);
                ctx.fillStyle = '#332222';
                ctx.fillRect(Math.floor(cx - 2), Math.floor(cy + 3), 1, 2);
                ctx.fillRect(Math.floor(cx), Math.floor(cy + 3), 1, 2);
                ctx.fillRect(Math.floor(cx + 2), Math.floor(cy + 3), 1, 2);

                // Side flames
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#44ee44';
                ctx.fillRect(Math.floor(cx - 5), Math.floor(cy - 2 + Math.sin(t * 8) * 2), 2, 3);
                ctx.fillRect(Math.floor(cx + 4), Math.floor(cy - 2 + Math.sin(t * 8 + 1) * 2), 2, 3);
                ctx.globalAlpha = 1;
                break;
            }
        }

        ctx.restore();
    }
};
