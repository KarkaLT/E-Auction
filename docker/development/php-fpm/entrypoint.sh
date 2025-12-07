#!/bin/bash
set -e

# Ensure storage and cache directories exist and have correct permissions
mkdir -p /var/www/storage/framework/{sessions,views,cache}
mkdir -p /var/www/storage/logs
mkdir -p /var/www/bootstrap/cache

chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Ensure the standard Laravel storage symlink exists so /storage routes are served from public
if [ ! -L /var/www/public/storage ]; then
	php artisan storage:link || true
fi

# Clear any cached configurations for development
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Execute the main command (php-fpm)
exec "$@"
