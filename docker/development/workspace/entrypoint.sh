#!/bin/bash
set -e

# Source NVM to make node/npm available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Print node and npm versions for debugging
node -v || true
npm -v || true

# Ensure logs dir exists
mkdir -p /var/www/storage/logs

# Install dependencies if node_modules is missing or incompatible

echo "Installing dependencies..."
cd /var/www
if [ -f package-lock.json ]; then
  npm ci || { echo "npm ci failed, falling back to npm i"; npm i; }
else
  npm i
fi

# Start Vite dev server in the background
echo "Starting Vite dev server..."

# Start Vite dev server in the foreground so logs go to container stdout/stderr.
# Running in foreground is preferred in containers so the process receives signals correctly
# and logs are captured by Docker (no nohup or backgrounding).
exec npm run dev
