// Enchanted Shadows - Level data and tile rendering
const Levels = {
    // Tile type constants
    TILE: {
        EMPTY:       0,
        GRASS_TOP:   1,
        DIRT:        2,
        STONE:       3,
        STONE_BRICK: 4,
        WOOD_PLAT:   5,   // one-way platform
        CASTLE_FLOOR:6,
        SPIKES:      7,
        ICE:         8,
        INVIS_WALL:  9,
        GRASS_DECO:  10,
        FLOWER_DECO: 11,
        TORCH:       12,
        CRYSTAL:     13,
        EXIT_PORTAL: 14,
        ROCK:        15,
        DASH_BLOCK:  16
    },

    TILE_SIZE: 32,

    // All level data
    data: [],

    init() {
        this.data.push(this._createForestClearing());
        this.data.push(this._createDeepForest());
        this.data.push(this._createMysticGrove());
        this.data.push(this._createForestEdge());
        this.data.push(this._createCastleGate());
        this.data.push(this._createCastleHalls());
        this.data.push(this._createDungeonDepths());
        this.data.push(this._createTowerAscent());
        this.data.push(this._createShadowKingsThrone());
    },

    // Level 0: Forest Clearing (tutorial)
    _createForestClearing() {
        const cols = 60;
        const rows = 15;
        const _ = 0;   // empty
        const G = 1;   // grass top
        const D = 2;   // dirt
        const W = 5;   // wood platform
        const S = 7;   // spikes
        const g = 10;  // grass decoration
        const f = 11;  // flower decoration
        const E = 14;  // exit portal
        const R = 15;  // rock

        // Build tile map row by row (0 = top, 14 = bottom)
        // 60 columns wide, 15 rows tall
        const tiles = [
            //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 0
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 1
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 2
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 3
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,_ ],  // row 4  - exit portal high up
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_ ],  // row 5  - platform to exit
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 6
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_ ],  // row 7  - mid platforms
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 8
            [  _,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 9  - lower platforms
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 10
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 11
            [  g,f,_,_,g,_,_,_,_,_,_,R,_,_,_,_,_,g,_,_,f,_,g,_,_,_,_,R,_,_,g,f,_,_,_,g,_,_,_,_,_,_,g,f,_,_,R,_,g,_,f,_,_,_,g,_,_,_,_,f ],  // row 12 - decorations + rocks
            [  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G ],  // row 13 - grass top (2 gaps)
            [  D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D ],  // row 14 - dirt
        ];

        return {
            name: "Forest Clearing",
            theme: "forest",
            cols: cols,
            rows: rows,
            tiles: tiles,
            startX: 64,        // left side, on ground
            startY: 386,       // row 13 top (13*32=416) minus player height (30) = 386
            // Enemies sit past the tutorial signs so reading is safe
            enemies: [
                { type: 'wolf', x: 560, y: 384 },
                { type: 'bat',  x: 1100, y: 300 }
            ],
            puzzles: [],
            hints: [
                { col: 3, row: 12, text: 'Move with ARROWS or WASD - SPACE to jump!' },
                { col: 8, row: 12, text: 'Press J or Z to throw ninja stars!' },
                { col: 16, row: 12, text: 'Careful - jump over the gaps!' },
                { col: 24, row: 12, text: 'Press 1 2 3 4 to cast magic spells!' },
                { col: 52, row: 12, text: 'Hop up the platforms to reach the portal!' }
            ],
            // [col, row] coin positions - trails mark the jumps and platforms
            coins: [
                [7, 8], [8, 8], [9, 8], [14, 6], [15, 6], [16, 6], [17, 6],
                [18, 12], [19, 12], [25, 8], [26, 8], [27, 8],
                [37, 6], [38, 6], [39, 6], [40, 6], [41, 12], [42, 12],
                [44, 8], [45, 8], [51, 6], [52, 6], [55, 4], [56, 4], [57, 4]
            ],
            exitX: 57 * 32,    // near exit portal tile
            exitY: 4 * 32,
            get widthPx()  { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 1: Deep Forest
    _createDeepForest() {
        const cols = 80;
        const rows = 15;
        const _ = 0, G = 1, D = 2, S = 3, W = 5, K = 7, g = 10, f = 11, E = 14, R = 15;

        const tiles = [
            //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 0
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 1
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 2
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,_,_ ],  // row 3
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_ ],  // row 4
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 5
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_ ],  // row 6
            [  _,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 7
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 8
            [  _,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 9
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 10
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 11
            [  g,f,_,_,g,_,R,_,_,_,g,f,_,_,_,R,g,_,_,_,_,f,_,_,_,_,_,g,R,_,_,_,f,g,_,_,_,_,_,_,_,g,_,f,_,_,_,_,R,_,g,_,_,f,_,_,_,_,g,_,R,_,f,_,_,g,_,_,_,R,_,f,g,_,_,_,_,_,_,f ],  // row 12
            [  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,G,G,G,G,G,G,_,_,G,G,G,G,G,G,G,K,K,K,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G ],  // row 13
            [  D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,_,D,D,D,D,D,D,D,D,D,D,D,D,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D ],  // row 14
        ];

        return {
            name: "Deep Forest",
            theme: "forest",
            cols: cols,
            rows: rows,
            tiles: tiles,
            startX: 64,
            startY: 386,
            enemies: [
                { type: 'wolf',   x: 320,  y: 384 },
                { type: 'wolf',   x: 800,  y: 384 },
                { type: 'wolf',   x: 1600, y: 384 },
                { type: 'bat',    x: 600,  y: 260 },
                { type: 'bat',    x: 1200, y: 220 },
                { type: 'spider', x: 1900, y: 384 }
            ],
            puzzles: [
                { type: 'pressurePlate', id: 'pp1', x: 1056, y: 408, width: 32, height: 8 },
                { type: 'movingPlatform', linkedId: 'pp1', requiresTrigger: true, x: 1184, y: 416, startX: 1184, startY: 416, endX: 1184, endY: 256, width: 64, speed: 60 }
            ],
            coins: [
                [6, 8], [7, 8], [12, 6], [13, 6], [18, 4], [19, 4],
                [22, 12], [23, 12], [24, 12], [28, 5], [29, 5], [38, 6], [39, 6],
                [46, 12], [47, 12], [48, 11], [48, 7], [49, 7],
                [55, 8], [56, 8], [58, 5], [59, 5], [62, 12], [63, 12],
                [67, 5], [68, 5], [74, 3], [75, 3]
            ],
            exitX: 76 * 32,
            exitY: 3 * 32,
            get widthPx()  { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 2: Mystic Grove
    _createMysticGrove() {
        const cols = 70;
        const rows = 15;
        const _ = 0, G = 1, D = 2, S = 3, W = 5, K = 7, g = 10, f = 11, C = 13, E = 14, R = 15;

        const tiles = [
            //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 0
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 1
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,_ ],  // row 2
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_ ],  // row 3
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 4
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_ ],  // row 5
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 6
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 7
            [  _,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 8
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 9
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 10
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 11
            [  g,f,_,_,g,_,R,_,_,f,_,_,_,g,_,R,_,_,f,_,_,g,_,_,_,_,f,R,_,g,_,_,_,_,R,f,g,_,_,_,_,R,g,_,_,_,f,_,R,_,g,_,_,_,_,f,_,_,g,R,_,_,_,f,_,_,_,_,g,f ],  // row 12
            [  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G ],  // row 13
            [  D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D ],  // row 14
        ];

        // The crystal door must truly gate the exit. The old portal hung in the
        // sky with 11 rows of open air over the door, so the player could hop
        // over it and the crystals meant nothing. Now a rune-sealed wall spans
        // from ceiling to the door, and the portal waits behind it at ground level.
        const X = 16;
        for (let row = 0; row <= 10; row++) tiles[row][63] = X;
        tiles[2][67] = _;                                          // remove old sky portal
        for (let col = 65; col <= 68; col++) tiles[3][col] = _;    // and its platform
        tiles[12][67] = E;                                         // portal behind the door

        return {
            name: "Mystic Grove",
            theme: "forest",
            cols: cols,
            rows: rows,
            tiles: tiles,
            startX: 64,
            startY: 386,
            enemies: [
                { type: 'spider', x: 500,  y: 384 },
                { type: 'spider', x: 1400, y: 384 },
                { type: 'bat',    x: 400,  y: 280 },
                { type: 'bat',    x: 900,  y: 240 },
                { type: 'bat',    x: 1700, y: 260 }
            ],
            puzzles: [
                { type: 'crystal', id: 'c1', group: 'grove1', x: 352, y: 384, width: 32, height: 32 },
                { type: 'crystal', id: 'c2', group: 'grove1', x: 1024, y: 384, width: 32, height: 32 },
                { type: 'door', linkedId: 'grove1', x: 2016, y: 352, width: 32, height: 64 }
            ],
            hints: [
                { col: 8, row: 12, text: 'Collect ALL the glowing crystals to open the sealed door!' }
            ],
            coins: [
                [10, 7], [11, 7], [12, 7], [16, 5], [17, 5],
                [20, 12], [21, 12], [22, 12], [23, 3], [24, 3],
                [32, 6], [33, 6], [38, 8], [39, 8], [42, 12], [43, 12], [44, 12],
                [44, 6], [45, 6], [48, 4], [49, 4], [54, 7], [55, 7], [60, 4], [61, 4],
                [65, 11], [66, 11], [67, 11]   // reward trail behind the crystal door
            ],
            exitX: 67 * 32,
            exitY: 2 * 32,
            get widthPx()  { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 3: Forest Edge
    _createForestEdge() {
        const cols = 80;
        const rows = 18;
        const _ = 0, G = 1, D = 2, S = 3, B = 4, W = 5, K = 7, g = 10, f = 11, E = 14, R = 15;

        const tiles = [
            //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 0
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 1
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 2
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 3
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,_,_ ],  // row 4
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_ ],  // row 5
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 6
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_ ],  // row 7
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 8
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 9
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 10
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,W,W,W,W,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 11
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 12
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,S,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 13
            [  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,S,S,S,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_ ],  // row 14
            [  g,f,_,_,g,_,R,_,_,f,_,_,g,R,_,_,_,f,_,_,_,R,g,_,_,_,_,_,f,_,g,_,_,_,_,_,_,_,_,_,_,_,_,g,R,f,_,_,g,_,_,_,f,_,_,_,R,g,_,f,_,_,R,_,g,_,_,_,_,f,_,R,g,_,_,_,_,f,_,g ],  // row 15
            [  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G ],  // row 16
            [  D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,_,_,_,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D ],  // row 17
        ];

        return {
            name: "Forest Edge",
            theme: "forest",
            cols: cols,
            rows: rows,
            tiles: tiles,
            startX: 64,
            startY: 482,       // row 16 top (16*32=512) minus player height (30) = 482
            enemies: [
                { type: 'shadowSoldier', x: 500,  y: 480 },
                { type: 'shadowSoldier', x: 1200, y: 480 },
                { type: 'shadowSoldier', x: 2000, y: 480 },
                { type: 'wolf',          x: 800,  y: 480 },
                { type: 'wolf',          x: 1700, y: 480 }
            ],
            puzzles: [],
            coins: [
                [14, 8], [15, 8], [20, 6], [21, 6], [28, 7], [29, 7],
                [33, 15], [36, 15], [39, 15],   // trail through the tunnel under the spike hill
                [49, 14], [50, 14], [51, 14], [54, 10], [55, 10],
                [62, 7], [63, 7], [68, 6], [69, 6], [74, 4], [75, 4]
            ],
            hearts: [[42, 15]],   // a reward waiting at the end of the spike tunnel
            exitX: 76 * 32,
            exitY: 4 * 32,
            get widthPx()  { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },



    // Level 4: Castle Gate - 2 floors, 1 key, 1 locked door
    _createCastleGate() {
        const cols = 45;
        const rows = 16;
        const _ = 0, B = 4, F = 6, K = 7, T = 12, E = 14, D = 16;

        // Upper floor at row 5. Player walks at row 4 area. Exit room at floor level.
        const tiles = [
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,D,D,D,D,D,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,_,_,_,D,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,D,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,_,_,_,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,T,_,_,B,T,_,_,_,_,_,_,B,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,B,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,B,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,F,F,F,F,F,F,F,B,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
        ];

        // The key room (cols 32-38) was sealed on all sides - the key was
        // unreachable without an obscure mid-air dash through a wall. Open a
        // shaft under it so a springboard can bounce the player up inside.
        tiles[10][34] = _; tiles[10][35] = _;
        tiles[11][34] = _; tiles[11][35] = _;

        return {
            name: "Castle Gate",
            theme: "castle",
            cols: cols, rows: rows, tiles: tiles,
            startX: 64, startY: 450,
            enemies: [
                { type: 'shadowSoldier', x: 350, y: 448 },
                { type: 'shadowSoldier', x: 700, y: 448 },
                { type: 'shadowSoldier', x: 1050, y: 448 },
                { type: 'bat', x: 500, y: 260 },
                { type: 'bat', x: 800, y: 50 }
            ],
            puzzles: [
                { type: 'springBoard', id: 'sb1', x: 14 * 32, y: 15 * 32 - 12, width: 64, power: -820 },
                { type: 'springBoard', id: 'sb2', x: 34 * 32, y: 15 * 32 - 12, width: 64, power: -700 },
                { type: 'key', id: 'k1', x: 35 * 32, y: 9 * 32, width: 24, height: 24 },
                { type: 'lockedDoor', id: 'ld1', x: 36 * 32, y: 3 * 32, width: 32, height: 64 }
            ],
            hints: [
                { col: 32, row: 13, text: 'Boing! Bounce up high to find the key!' }
            ],
            coins: [
                [5, 13], [10, 13], [20, 13], [25, 13], [30, 13],
                [15, 12], [15, 9], [15, 6],          // springboard launch trail
                [33, 9], [36, 9], [37, 9], [38, 9],  // key room treasure
                [5, 3], [11, 3], [18, 3], [25, 3], [31, 3]
            ],
            hearts: [[33, 8]],
            exitX: 38 * 32, exitY: 4 * 32,
            get widthPx() { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 5: Castle Halls - 3 floors, 2 keys, 2 locked doors
    _createCastleHalls() {
        const cols = 45;
        const rows = 22;
        const _ = 0, B = 4, W = 5, F = 6, K = 7, T = 12, E = 14, D = 16;

        // Ground floor at row 21. Mid floor at row 10. Top floor at row 4.
        // Exit room on top floor at floor level. All doors at walking height.
        const tiles = [
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,T,B,T,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,D,D,D,D,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,_,_,_,D,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,D,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,B,F,F,F,F,F,F,F,F,F,F,F,F,F,_,_,_,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,B,_,_,_,_,_,_,_,_,T,_,_,_,_,B,T,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,F,F,F,F,F,F,F,F,F,B ],
            [  B,F,F,F,F,F,F,F,F,_,_,_,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,B,B,B,B,B,B,B,B,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
        ];

        // This level used to deadlock: both keys sat behind locked door hld1,
        // which itself needs a key. Now the first key floats in the mid floor
        // before the door, the right wing (second key) gets a walk-in doorway,
        // and the top-left room becomes an open treasure room.
        tiles[2][9] = _; tiles[3][9] = _;      // doorway into top-left treasure room
        tiles[7][34] = _; tiles[8][34] = _;    // doorway into the right wing
        tiles[2][36] = _;                      // exit door's top was buried in wall

        return {
            name: "Castle Halls",
            theme: "castle",
            cols: cols, rows: rows, tiles: tiles,
            startX: 64, startY: 642,
            enemies: [
                { type: 'shadowSoldier', x: 350, y: 640 },
                { type: 'shadowSoldier', x: 700, y: 640 },
                { type: 'shadowSoldier', x: 300, y: 290 },
                { type: 'skeletonMage', x: 600, y: 290 },
                { type: 'skeletonMage', x: 400, y: 100 },
                { type: 'bat', x: 500, y: 50 },
                { type: 'bat', x: 900, y: 200 }
            ],
            puzzles: [
                { type: 'springBoard', id: 'sb1', x: 9 * 32, y: 21 * 32 - 12, width: 64, power: -820 },
                { type: 'springBoard', id: 'sb2', x: 23 * 32, y: 10 * 32 - 12, width: 64, power: -820 },
                // First key floats mid-floor BEFORE locked door hld1 (jump to grab it)
                { type: 'key', id: 'hk1', x: 16 * 32, y: 8 * 32, width: 24, height: 24 },
                { type: 'key', id: 'hk2', x: 39 * 32, y: 7 * 32, width: 24, height: 24 },
                { type: 'lockedDoor', id: 'hld1', x: 20 * 32, y: 8 * 32, width: 32, height: 64 },
                { type: 'lockedDoor', id: 'hld2', x: 36 * 32, y: 2 * 32, width: 32, height: 64 }
            ],
            coins: [
                [4, 20], [14, 20], [18, 20], [25, 20],
                [10, 17], [10, 14], [10, 11],   // springboard trail to the mid floor
                [13, 8], [19, 8],
                [24, 8], [24, 5], [24, 2],      // springboard trail to the top floor
                [36, 8], [37, 8], [41, 8], [42, 8],         // right wing
                [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],  // treasure room
                [12, 2], [16, 2], [20, 2], [28, 3], [32, 3]
            ],
            hearts: [[5, 3], [41, 7]],
            exitX: 38 * 32, exitY: 3 * 32,
            get widthPx() { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 6: Dungeon Depths - 2 keys, 2 locked doors, ice + spikes
    _createDungeonDepths() {
        const cols = 45;
        const rows = 18;
        const _ = 0, B = 4, W = 5, F = 6, K = 7, I = 8, T = 12, C = 13, E = 14, D = 16;

        // Upper floor at row 5. Exit room at upper floor level. 2 keys, 2 locked doors.
        const tiles = [
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,_,D,D,D,D,D,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,_,_,_,_,_,_,D,_,_,_,D,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,D,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,_,_,_,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
            [  B,B,B,B,B,B,B,B,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,B,T,_,_,_,B,_,_,_,_,_,B,T,_,_,_,B,_,_,_,_,_,B,T,_,_,_,B,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,B,_,_,_,_,_,B,_,_,_,_,B,_,_,_,_,_,B,_,_,_,_,B,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,B,_,_,_,_,B,_,_,_,_,_,B,_,_,_,_,B,_,_,_,_,_,B,_,_,_,_,B,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,B,F,F,F,F,B,_,_,_,_,_,B,F,F,F,F,B,_,_,_,_,_,B,F,F,F,F,B,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_,B,B,B,B,B,B,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,K,K,K,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,I,B ],
        ];

        // Both key rooms were sealed boxes floating mid-air, so the keys (and
        // therefore the exit) were unreachable. Open shafts beneath them for
        // springboard entry from the dungeon floor.
        tiles[10][15] = _; tiles[10][16] = _;
        tiles[11][15] = _; tiles[11][16] = _;
        tiles[10][37] = _; tiles[10][38] = _;
        tiles[11][37] = _; tiles[11][38] = _;

        return {
            name: "Dungeon Depths",
            theme: "castle",
            cols: cols, rows: rows, tiles: tiles,
            startX: 64, startY: 514,
            enemies: [
                { type: 'skeletonMage', x: 300, y: 512 },
                { type: 'skeletonMage', x: 900, y: 512 },
                { type: 'shadowSoldier', x: 600, y: 512 },
                { type: 'shadowSoldier', x: 1100, y: 512 },
                { type: 'shadowSoldier', x: 500, y: 130 },
                { type: 'bat', x: 400, y: 50 },
                { type: 'bat', x: 800, y: 50 }
            ],
            puzzles: [
                { type: 'springBoard', id: 'dsb1', x: 8 * 32, y: 17 * 32 - 12, width: 64, power: -950 },
                { type: 'springBoard', id: 'dsb2', x: 15 * 32, y: 17 * 32 - 12, width: 64, power: -780 },
                { type: 'springBoard', id: 'dsb3', x: 37 * 32, y: 17 * 32 - 12, width: 64, power: -780 },
                { type: 'key', id: 'dk1', x: 15 * 32 + 8, y: 9 * 32, width: 24, height: 24 },
                { type: 'key', id: 'dk2', x: 37 * 32 + 8, y: 9 * 32, width: 24, height: 24 },
                { type: 'lockedDoor', id: 'dld1', x: 25 * 32, y: 3 * 32, width: 32, height: 64 },
                { type: 'lockedDoor', id: 'dld2', x: 36 * 32, y: 3 * 32, width: 32, height: 64 }
            ],
            coins: [
                [5, 15], [12, 15], [20, 15], [28, 15], [33, 15], [42, 15],
                [22, 14], [23, 13], [24, 14],   // arc over the spikes
                [9, 14], [9, 10], [9, 7],       // big springboard trail
                [14, 9], [17, 9], [36, 9], [39, 9],   // key rooms
                [5, 3], [12, 3], [18, 3], [30, 3], [33, 3]
            ],
            hearts: [[16, 8], [38, 8]],
            exitX: 38 * 32, exitY: 4 * 32,
            get widthPx() { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 7: Tower Ascent - 4 floors, spring boards, 2 keys, 2 locked doors
    _createTowerAscent() {
        const cols = 30;
        const rows = 22;
        const _ = 0, B = 4, W = 5, F = 6, K = 7, T = 12, E = 14, D = 16;

        // Floors at rows 4, 9, 14, 21. Exit room on top floor at floor level.
        const tiles = [
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,D,D,D,D,D,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,_,_,_,_,D,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,E,_,D,_,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,_,_,_,F,B ],
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,T,B,_,_,_,_,_,_,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,F,F,_,_,_,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
            [  B,B,B,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,_,_,_,F,F,B ],
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,B,B,B ],
            [  B,T,_,_,_,_,_,_,_,_,_,_,_,_,T,_,_,_,_,_,_,_,_,_,_,_,_,_,T,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],
        ];

        // The exit door's top half was buried inside a rune wall tile
        tiles[2][19] = _;

        return {
            name: "Tower Ascent",
            theme: "castle",
            cols: cols, rows: rows, tiles: tiles,
            startX: 64, startY: 642,
            enemies: [
                { type: 'bat', x: 300, y: 560 },
                { type: 'bat', x: 500, y: 370 },
                { type: 'bat', x: 700, y: 200 },
                { type: 'bat', x: 400, y: 50 },
                { type: 'skeletonMage', x: 500, y: 418 },
                { type: 'skeletonMage', x: 300, y: 230 },
                { type: 'shadowSoldier', x: 600, y: 418 },
                { type: 'shadowSoldier', x: 200, y: 230 }
            ],
            puzzles: [
                { type: 'springBoard', id: 'tsb1', x: 24 * 32, y: 21 * 32 - 12, width: 64, power: -820 },
                { type: 'springBoard', id: 'tsb2', x: 3 * 32, y: 14 * 32 - 12, width: 64, power: -820 },
                { type: 'springBoard', id: 'tsb3', x: 25 * 32, y: 9 * 32 - 12, width: 64, power: -820 },
                { type: 'key', id: 'tk1', x: 24 * 32, y: 19 * 32, width: 24, height: 24 },
                { type: 'key', id: 'tk2', x: 4 * 32, y: 12 * 32, width: 24, height: 24 },
                { type: 'lockedDoor', id: 'tld1', x: 14 * 32, y: 7 * 32, width: 32, height: 64 },
                { type: 'lockedDoor', id: 'tld2', x: 19 * 32, y: 2 * 32, width: 32, height: 64 }
            ],
            coins: [
                [6, 19], [10, 19], [15, 19], [20, 19],
                [25, 18], [25, 15], [25, 12],   // bounce trail to floor 2
                [6, 12], [10, 12], [18, 12], [21, 12],
                [4, 11], [4, 8], [4, 6],        // bounce trail to floor 3
                [7, 7], [10, 7], [18, 7], [22, 7],
                [26, 6], [26, 4],               // bounce trail to the top
                [5, 2], [9, 2], [12, 2]
            ],
            hearts: [[8, 7], [16, 2]],
            exitX: 22 * 32, exitY: 3 * 32,
            get widthPx() { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Level 8: Shadow King's Throne (Boss)
    _createShadowKingsThrone() {
        const cols = 40;
        const rows = 15;
        const _ = 0, B = 4, F = 6, K = 7, T = 12, C = 13;

        const tiles = [
            //  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
            [  B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B ],  // row 0  - ceiling
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 1
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 2
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 3
            [  B,T,_,_,_,_,_,_,T,_,_,_,_,_,_,_,T,_,_,_,_,_,_,T,_,_,_,_,_,_,_,T,_,_,_,_,_,_,T,B ],  // row 4  - torches
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 5
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 6
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 7
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 8
            [  B,_,_,_,C,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,C,_,_,_,B ],  // row 9  - crystal deco
            [  B,T,_,_,_,_,_,_,T,_,_,_,_,_,_,_,T,_,_,_,_,_,_,T,_,_,_,_,_,_,_,T,_,_,_,_,_,_,T,B ],  // row 10 - torches
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 11
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 12
            [  B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B ],  // row 13
            [  B,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,B ],  // row 14 - floor
        ];

        return {
            name: "Shadow King's Throne",
            theme: "castle",
            cols: cols,
            rows: rows,
            tiles: tiles,
            startX: 64,
            startY: 418,       // row 14 top (14*32=448) minus player height (30) = 418
            enemies: [
                { type: 'shadowKing', x: 960, y: 320 }
            ],
            puzzles: [],
            hearts: [[4, 12], [35, 12]],   // a fighting chance against the king
            exitX: null,       // no exit - boss death triggers victory
            exitY: null,
            get widthPx()  { return this.cols * 32; },
            get heightPx() { return this.rows * 32; }
        };
    },

    // Render visible tiles for a level
    render(ctx, level, camera) {
        const ts = this.TILE_SIZE;

        // Calculate visible tile range (with 1-tile margin for partial tiles)
        const startCol = Math.max(0, Math.floor(camera.x / ts) - 1);
        const endCol   = Math.min(level.cols - 1, Math.floor((camera.x + camera.width) / ts) + 1);
        const startRow = Math.max(0, Math.floor(camera.y / ts) - 1);
        const endRow   = Math.min(level.rows - 1, Math.floor((camera.y + camera.height) / ts) + 1);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const tile = level.tiles[row][col];
                if (tile === 0) continue; // skip empty tiles

                const worldX = col * ts;
                const worldY = row * ts;

                // Cull tiles not visible on screen
                if (!camera.isVisible(worldX, worldY, ts, ts)) continue;

                const screenX = Math.floor(camera.screenX(worldX));
                const screenY = Math.floor(camera.screenY(worldY));

                Sprites.drawTile(ctx, tile, screenX, screenY, level.theme);
            }
        }
    }
};

// Initialize level data immediately
Levels.init();
