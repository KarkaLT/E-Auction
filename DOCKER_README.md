# Docker Development Setup

This Laravel application is configured to run in Docker containers following the official Docker documentation for Laravel development.

## Services

- **web**: Nginx web server (port 80)
- **php-fpm**: PHP-FPM for running PHP code with Xdebug enabled
- **workspace**: CLI container for running Artisan commands, Composer, and npm
- **mysql**: MySQL 8.0 database
- **redis**: Redis for caching and sessions

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Getting Started

### 1. Start the Development Environment

```bash
docker compose -f compose.dev.yaml up --build -d
```

This command will:

- Build all Docker images
- Start all services in detached mode
- Create a MySQL database
- Set up Redis

### 2. Install Dependencies (First Time Setup)

Access the workspace container to run Composer and npm:

```bash
docker compose -f compose.dev.yaml exec workspace bash
```

Inside the workspace container:

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Build assets
npm run build

# Run migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed

# Exit the container
exit
```

### 3. Access Your Application

Visit [http://localhost](http://localhost) in your browser.

## Common Commands

### Start the environment

```bash
docker compose -f compose.dev.yaml up -d
```

### Stop the environment

```bash
docker compose -f compose.dev.yaml down
```

### View logs

```bash
docker compose -f compose.dev.yaml logs -f
```

### Access workspace (for Artisan, Composer, npm)

```bash
docker compose -f compose.dev.yaml exec workspace bash
```

### Run Artisan commands

```bash
docker compose -f compose.dev.yaml exec workspace php artisan [command]
```

Example:

```bash
docker compose -f compose.dev.yaml exec workspace php artisan make:controller UserController
```

### Run Composer commands

```bash
docker compose -f compose.dev.yaml exec workspace composer [command]
```

### Run npm commands

```bash
docker compose -f compose.dev.yaml exec workspace bash -c "source ~/.nvm/nvm.sh && npm [command]"
```

### Access MySQL database

```bash
docker compose -f compose.dev.yaml exec mysql mysql -u laravel -psecret laravel
```

## Environment Variables

The following environment variables are configured in `.env`:

- `DB_CONNECTION=mysql`
- `DB_HOST=mysql` (Docker service name)
- `DB_PORT=3306`
- `DB_DATABASE=laravel`
- `DB_USERNAME=laravel`
- `DB_PASSWORD=secret`
- `REDIS_HOST=redis` (Docker service name)

## Xdebug Configuration

Xdebug is enabled by default in development. Configure your IDE:

- **IDE Key**: DOCKER
- **Host**: host.docker.internal
- **Port**: 9003

To disable Xdebug, set in `.env` or as environment variable:

```
XDEBUG_ENABLED=false
```

## File Permissions

The workspace and php-fpm containers run with your host user ID to avoid permission issues. The UID and GID are set to 1000 by default. If you need different values, set them in your shell:

```bash
export UID=$(id -u)
export GID=$(id -g)
```

## Troubleshooting

### Container won't start

```bash
docker compose -f compose.dev.yaml logs php-fpm
```

### Permission issues

```bash
docker compose -f compose.dev.yaml exec workspace bash
chmod -R 775 storage bootstrap/cache
```

### Clear Laravel cache

```bash
docker compose -f compose.dev.yaml exec workspace php artisan cache:clear
docker compose -f compose.dev.yaml exec workspace php artisan config:clear
docker compose -f compose.dev.yaml exec workspace php artisan route:clear
docker compose -f compose.dev.yaml exec workspace php artisan view:clear
```

### Rebuild containers

```bash
docker compose -f compose.dev.yaml down
docker compose -f compose.dev.yaml up --build -d
```

## Project Structure

```
E-Auction/
├── docker/
│   ├── common/
│   │   └── php-fpm/
│   │       └── Dockerfile
│   ├── development/
│   │   ├── php-fpm/
│   │   │   └── entrypoint.sh
│   │   ├── workspace/
│   │   │   └── Dockerfile
│   │   └── nginx/
│   │       └── nginx.conf
│   └── production/
│       └── php-fpm/
│           └── entrypoint.sh
├── compose.dev.yaml
├── .dockerignore
└── .env
```
