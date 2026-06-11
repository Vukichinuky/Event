#!/usr/bin/env bash
# Deploy na Mac Mini: povuci kod, instaliraj, migriraj bazu, build, restart PM2.
set -euo pipefail
cd "$(dirname "$0")/.."

git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 startOrReload ecosystem.config.cjs
pm2 save

echo "Deploy gotov."
