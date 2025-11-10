#!/bin/bash
set -e

# Initialize Laravel storage if it doesn't exist or is empty
if [ ! -d "/var/www/storage/app" ] || [ -z "$(ls -A /var/www/storage/app)" ]; then
    echo "Initializing storage directory..."
    cp -rn /var/www/storage-init/* /var/www/storage/ 2>/dev/null || true
fi

# Ensure storage and cache directories have correct permissions
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Run Laravel optimization commands
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Execute the main command (php-fpm)
exec "$@"
