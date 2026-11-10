#!/bin/sh
set -e
cd "$(dirname "$0")/.."
git fetch -q origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && exit 0
git merge -q --ff-only origin/main
docker compose up -d --build site
