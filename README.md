# Enchanted Shadows

A 2D side-scrolling action platformer built with vanilla JavaScript and the Canvas 2D API.
No frameworks, no build step, no external assets — all sprites are drawn procedurally and
all sound is synthesized in the browser with the Web Audio API.

Play as a ninja mage fighting through forests, a castle, and a dungeon to defeat the
Shadow King across 9 levels: Forest Clearing, Deep Forest, Mystic Grove, Forest Edge,
Castle Gate, Castle Halls, Dungeon Depths, Tower Ascent, and the Shadow King's Throne.

## Features

- Tile-based platforming with one-way platforms, ice, spikes, and pits
- Four spells on a mana system:
  - **Fireball** (20 mana) — ranged projectile
  - **Freeze** (25 mana) — freezes nearby enemies for 3 seconds
  - **Shadow Dash** (15 mana) — burst of speed that phases through walls (but not
    runed dash-block tiles)
  - **No-Sense** (30 mana) — disorients nearby enemies for 5 seconds
- Enemies with distinct behaviors: wolves, bats, spiders, shadow soldiers, and
  skeleton mages, plus a multi-phase Shadow King boss fight
- Puzzles: switches, moving platforms, crystals, keys, and locked doors
- Coins scattered through every level (with a HUD counter) — coin trails mark the
  way through trickier routes, and your total carries across levels in a run
- Heart pickups: enemies sometimes drop one when defeated, and a few are hidden in
  treasure spots; each restores one full heart
- Tutorial signs in the first levels explain movement, attacking, spells, and portals;
  sealed doors give a hint when you bump into them
- Save and continue: progress (name, level, coins) is saved automatically at each
  level transition — press **C** on the title screen to pick up where you left off
- Forgiving jump controls (coyote time and jump buffering)
- Procedural pixel art and synthesized audio, including looping chiptune background
  music — the whole game is a few JS files

## Controls

| Action      | Keys                          |
|-------------|-------------------------------|
| Move        | Arrow keys or WASD            |
| Jump        | Space, Up, or W               |
| Attack      | J or Z                        |
| Fireball    | 1                             |
| Freeze      | 2                             |
| Shadow Dash | 3                             |
| No-Sense    | 4                             |
| Pause       | Escape or P                   |
| Confirm     | Enter or Space                |
| Toggle music| M                             |
| Continue    | C (on the title screen)       |

## Running locally

The game is plain static files — serve the `enchanted_shadows/` directory with any
web server:

```bash
cd enchanted_shadows
python -m http.server 8080
```

Then open <http://localhost:8080>.

## Running in a container

```bash
podman build -t zelda-games .
podman run --rm -p 8080:80 zelda-games
```

(Substitute `docker` for `podman` if that's your runtime.)

## Deployment

`docker-compose.yml` runs two services: an nginx container serving the game and a
[cloudflared](https://github.com/cloudflare/cloudflared) sidecar that publishes it
through a Cloudflare Tunnel — no inbound ports need to be opened on the host.

1. Create a tunnel in the Cloudflare Zero Trust dashboard and copy its token.
2. Copy `.env.example` to `.env` and set `TUNNEL_TOKEN`.
3. Start the stack:

```bash
podman-compose up -d
```

In the tunnel's public hostname settings, point the route at `http://zelda-games:80`.

## License

See [LICENSE](LICENSE).
