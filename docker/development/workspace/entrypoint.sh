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

# Install composer dependencies if vendor/autoload.php is missing. This helps
# when the project is bind-mounted into the container (the image's vendor dir
# will be hidden by the host mount), which causes PHP containers to fail.
if [ ! -f /var/www/vendor/autoload.php ]; then
  echo "Vendor autoload not found, installing PHP dependencies via composer..."
  if command -v composer >/dev/null 2>&1; then
    composer install --prefer-dist --no-interaction --no-progress || {
      echo "composer install failed"; exit 1;
    }
  else
    echo "composer not found in container: skipping composer install";
  fi
fi

# Start Vite dev server in the background
echo "Starting Vite dev server..."

# Start Vite dev server in the foreground so logs go to container stdout/stderr.
# Running in foreground is preferred in containers so the process receives signals correctly
# and logs are captured by Docker (no nohup or backgrounding).
# Ensure the storage symlink exists so the /storage route is available from the web server
if [ ! -L /var/www/public/storage ]; then
  # The command is idempotent; attempt to create the link if possible
  php artisan storage:link || true
fi

exec npm run dev
