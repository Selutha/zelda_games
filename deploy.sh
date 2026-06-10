#!/usr/bin/env bash
# Deploy Enchanted Shadows to the NUC.
#
# Pushes the current branch, then pulls and rebuilds the container stack on the
# remote host. Override the defaults with environment variables:
#
#   NUC_HOST=root@nuc1 REMOTE_DIR=/home/selutha/zelda_games ./deploy.sh
set -euo pipefail

NUC_HOST="${NUC_HOST:-root@nuc1}"
REMOTE_DIR="${REMOTE_DIR:-/home/selutha/zelda_games}"
# The repo on the NUC is owned by this user; pulling as root would break ownership
REMOTE_REPO_OWNER="${REMOTE_REPO_OWNER:-selutha}"
# Key-based auth only - never hang on a password prompt mid-deploy
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=10)

cd "$(dirname "$0")"

if [[ -n "$(git status --porcelain)" ]]; then
    echo "ERROR: uncommitted changes in the working tree - commit (or stash) before deploying." >&2
    git status --short >&2
    exit 1
fi

echo "==> Pushing $(git rev-parse --abbrev-ref HEAD) ($(git rev-parse --short HEAD))"
git push

echo "==> Updating ${NUC_HOST}:${REMOTE_DIR}"
ssh "${SSH_OPTS[@]}" "$NUC_HOST" "
    set -euo pipefail
    cd '$REMOTE_DIR'
    sudo -u '$REMOTE_REPO_OWNER' git pull --ff-only
    docker compose build zelda-games
    docker compose up -d
"

echo '==> Verifying'
local_head="$(git rev-parse HEAD)"
remote_head="$(ssh "${SSH_OPTS[@]}" "$NUC_HOST" "sudo -u '$REMOTE_REPO_OWNER' git -C '$REMOTE_DIR' rev-parse HEAD")"
if [[ "$local_head" != "$remote_head" ]]; then
    echo "ERROR: remote HEAD ($remote_head) does not match local HEAD ($local_head)." >&2
    exit 1
fi

ssh "${SSH_OPTS[@]}" "$NUC_HOST" "
    set -euo pipefail
    docker ps --filter name=zelda-games --format '{{.Names}}: {{.Status}}' | grep -q 'Up' \
        || { echo 'ERROR: zelda-games container is not running' >&2; exit 1; }
    docker exec zelda-games wget -qO /dev/null http://localhost/ \
        || { echo 'ERROR: nginx is not serving the game' >&2; exit 1; }
"

echo "==> Deployed $(git rev-parse --short HEAD) successfully."
