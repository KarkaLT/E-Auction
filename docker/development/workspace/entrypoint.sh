#!/bin/bash
set -e

# Source NVM to make node/npm available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Start Vite dev server in the background
echo "Starting Vite dev server..."
nohup npm run dev > /var/www/storage/logs/vite.log 2>&1 &

# Keep container running
exec bash
