# Copilot Instructions — E‑Auction (Laravel + Inertia + React)

Summary

- This repo is a Laravel backend with Inertia + React frontend (Vite + TypeScript).
- Backend responsibilities: business logic, persistence, authentication, queueing, email sending, and server-side route registration.
- Frontend responsibilities: views and UI (Inertia pages, React components, Tailwind + Radix UI). Routes are generated into `resources/js/routes` via `wayfinder`.

Note for AI agents

- This repo expects commands to be executed inside development containers. Always run commands in the `workspace` (or `php-fpm`) container using `docker compose -f compose.dev.yaml exec ...` or `docker compose -f compose.dev.yaml run --rm workspace ...`. Avoid executing commands directly on the host OS to ensure environment parity and UID/GID consistency.

Quick Start & Developer Workflows

- Setup (recommended):
  - composer setup (runs: composer install, set up .env, generate key, migrate, npm install & build)
  - OR: Run the steps manually: `composer install`, `cp .env.example .env`, `php artisan key:generate`, `php artisan migrate`, `npm install`.
- Run in dev: `composer dev` (runs `php artisan serve`, `php artisan queue:listen`, `php artisan pail`, and `npm run dev` concurrently).
  - NOTE: When using Docker, prefer running the stack with `docker compose -f compose.dev.yaml up -d` and run the respective processes inside the containers instead of running `composer dev` locally.
- SSR dev: `composer run dev:ssr` uses `php artisan inertia:start-ssr` & Vite.
- Build assets: `npm run build` — CI also runs `npm run build` before tests.
- Run tests: `./vendor/bin/pest` (CI does this), or `composer test`.
- Lint & format: `vendor/bin/pint` for PHP; `npm run lint`, `npm run format` for frontend; pre-commit is enforced by Husky + lint-staged.

Docker Development (required for local dev)

- This repository provides a Docker-based development stack: `compose.dev.yaml` defines `workspace`, `php-fpm`, `web`, `mysql`, `redis`, `mailpit` and other services. _Always run commands inside containers to match developer environment._
- Start the stack (detached):
  - `docker compose -f compose.dev.yaml up -d --build`
- Stop the stack:
  - `docker compose -f compose.dev.yaml down`
- One-off commands and interactive shells (preferred container: `workspace`):
  - Open a shell in the workspace container:
    - `docker compose -f compose.dev.yaml exec workspace bash`
  - Run a one-off command in the workspace container (npm/composer/artisan/tests):
    - `docker compose -f compose.dev.yaml exec workspace composer install`
    - `docker compose -f compose.dev.yaml exec workspace php artisan migrate --force`
    - `docker compose -f compose.dev.yaml exec workspace ./vendor/bin/pest`
    - `docker compose -f compose.dev.yaml exec workspace npm run dev` (Vite — already run by the workspace entrypoint but useful for manual runs)
  - If the container is not running use `docker compose -f compose.dev.yaml run --rm workspace <command>` to run a single command and then exit.
- Prefer running `php artisan` in either `workspace` or `php-fpm` depending on whether you want a CLI environment or to interact with the service that serves the web requests.
- UID/GID: this repo passes `UID`/`GID` as build args for proper file ownership; keep these consistent with your host user when building/running the containers. Example: `UID=$(id -u) GID=$(id -g) docker compose -f compose.dev.yaml up -d`.
  - POSIX shell (bash/zsh):
    - `UID=$(id -u) GID=$(id -g) docker compose -f compose.dev.yaml up -d`
  - fish shell (macOS default on your machine):
    - `set -x UID (id -u); set -x GID (id -g); docker compose -f compose.dev.yaml up -d`
- Windows / macOS caveats: containers expose ports for dev (e.g. `5173`, `80`, `3306`); on macOS, you may need to use `host.docker.internal` as the host for forwarded connections (this repo includes `XDEBUG_HOST` defaults accordingly).
- PHP extensions: The `workspace` and `php-fpm` Dockerfiles include PHP with common extensions and Xdebug; however `ext-gd` with WebP support is required for image conversion and is validated by `StoreAuctionItemPhotos`; ensure it's present in your container image if you run image-related tests.

Helpful docker toolbox (logs/restart/rebuild)

- Follow these for debugging and rebuilding images:
  - Follow logs: `docker compose -f compose.dev.yaml logs -f` or logs from a single service: `docker compose -f compose.dev.yaml logs -f workspace`
  - Restart a container: `docker compose -f compose.dev.yaml restart workspace`
  - Rebuild a single image: `docker compose -f compose.dev.yaml build --no-cache workspace`

Architecture & Key Patterns (what to know)

- Backend (app/): Laravel controllers, models, policies, actions, console commands, and mailables.
  - Business logic-heavy operations are implemented as single-responsibility Action classes in `app/Actions` (e.g., `StoreAuctionItemPhotos`). Prefer new Action classes instead of placing complex logic in controllers.
  - Controllers remain thin and handle request/validation/response (see `AuctionItemController`): use `DB::transaction()` for mutating operations.
  - Authorization is performed with Policies (e.g. `app/Policies/AuctionItemPolicy.php`) and middlewares: `EnsureSeller`, `EnsureUserIsAdmin`, `EnsureBuyer`, `EnsureUserNotBlocked`.
  - Email & queueing: use Laravel's Mailables and queue jobs; the repository uses `laravel/pail` (log collection) and `queue:listen` is part of dev flow.
  - CLI: scheduled/console commands implement important flows (ex: `EndExpiredAuctions` which marks auctions sold/finished and triggers `AuctionSoldMail`).

- Frontend (resources/js): Inertia + React with TypeScript.
  - Pages live in `resources/js/pages/*` and layouts in `resources/js/layouts/*` (e.g., `AppSidebarLayout`, `AppLayout`). Use the `AppLayout` (or `settings`/`auth` layouts) for rendering pages.
  - UI components in `resources/js/components/ui` are reusable and follow a composition/variant pattern (Class-Variance Authority). Explore `Sidebar`, `Button`, `Input`, etc.
  - Routes are generated and typed under `resources/js/routes/*` using the wayfinder system. Prefer using `   import auctionItems from '@/routes/auction-items'
auctionItems.create().url` for generating URLs.
  - Localization: Use `t('path.key')` helper (see `resources/js/i18n`), avoid hard-coding strings.
  - Shared data through Inertia: `SharedData` type (`resources/js/types/index.d.ts`) shows the server-provided props. Use `usePage<SharedData>().props` to access them.

Notable Implementation Details & Conventions

- Route registration order: be careful with resource route order — the code registers protected resource routes before the public `show` route to avoid the `create` path being interpreted as a model id. See `routes/web.php` and the comment above the route registration.
- Use `StoreAuctionItemPhotos` to process image uploads and convert to WebP on the server; it throws if the GD WebP extension is missing — tests / CI expect image handling to be validated.
- When you need to update sidebar state or similar JSON-only endpoints, the frontend uses `fetch()` with headers `Accept: 'application/json'` and `X-Inertia: 'false'` to avoid Inertia response handling. Example (from `AppSidebar`):
  - `await fetch('/settings/sidebar-state', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token ?? '', 'X-Inertia': 'false' }, body: JSON.stringify({ sidebar_open: isOpen }) })`
- File uploads: Controller validates `photos` with `image|mimes:jpeg,jpg,png,webp,avif|max:5120` and actions encode to WebP; keep validation in controllers and conversion in actions.
- Mutating operations typically use transactions, refresh model data before writing, and call `report($exception)` in catch blocks.

Naming & File Layout Conventions

- Actions: `app/Actions/<Feature>/<ActionName>.php` (e.g., `StoreAuctionItemPhotos`) — single responsibility classes.
- Controllers: `app/Http/Controllers/*Controller.php` (thin controllers; return Inertia views).
- Views: `resources/js/pages/*` (split by feature), `resources/js/layouts/*` (App / Auth / Settings), `resources/js/components` for UI.
- Routes: `routes/web.php`, `routes/settings.php` — small files and route groups (auth, admin, seller, buyer). Frontend route helpers are generated to `resources/js/routes/*`.

Coding Best Practices for AI Agents (actionable, repo-specific)

- Keep controllers thin: business logic should be moved to `app/Actions/*` and tested there.
- If adding a new route to a resource with both public & protected paths, follow `routes/web.php` order to avoid shadowing (always register protected resource routes BEFORE public `show` route or use explicit routes).
- Use `wayfinder` TypeScript route helpers `resources/js/routes/*` for consistent route generation on the front-end.
- For any endpoint consumed by the frontend that returns JSON (not an Inertia page), ensure the client sets `X-Inertia: 'false'` header when calling with `fetch`, and the backend returns JSON. See `AppSidebar` example.
- For file uploads: validate in the controller and convert or store in Actions; ensure `php-gd` or `ext-gd` with WebP support is available.
- Use `DB::transaction()` where mutually consistent state changes are needed (e.g., create auction + store photos) and keep catch blocks that cleanup and `report($e)`.
- When changing or granting role logic: confirm the role names used in code are `user`, `seller`, `buyer`, `admin`. Middleware `EnsureSeller`, `EnsureBuyer`, and `EnsureUserIsAdmin` control access to role-specific pages.

CI/Testing/Husky hooks

- CI uses PHP 8.4 and Node 22 (see `.github/workflows/*`). Run `./vendor/bin/pest` locally to match CI.
  - Run tests inside the workspace container to mirror CI:
    - `docker compose -f compose.dev.yaml exec workspace ./vendor/bin/pest`
- Use `vendor/bin/pint` for PHP formatting, `npm run format` for frontend formatting, `npm run lint` for linting.
- Husky + lint-staged runs `prettier` and eslint on staged files; don't bypass pre-commit hooks on PRs if unnecessary.
  - Run lint/format in container: `docker compose -f compose.dev.yaml exec workspace vendor/bin/pint` and `docker compose -f compose.dev.yaml exec workspace npm run lint`.

When adding features or refactors

- Prefer adding an Action for new logic and keep controllers minimal. Unit tests should target the Action and integration tests should verify controller interactions.
- Update `resources/js/routes/*` if you add new routes — regenerate using the wayfinder tooling if available (or follow the existing generator pattern used here).
- If adding an Inertia page, export the Inertia view from a controller and update a `resources/js/pages/*` file accordingly. Use `SharedData` if you need common props.

Small examples (copy-paste safe):

- Use typed route helpers in frontend code:
  - `import auctionItems from '@/routes/auction-items'
 Link href={auctionItems.create().url}
`
- Persist sidebar state from frontend:
  - `fetch('/settings/sidebar-state', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token, 'X-Inertia': 'false' }, body: JSON.stringify({ sidebar_open: isOpen }) })`
- Use Actions for complex business logic in backend:
  - `public function store(Request $request) { $validated = $request->validate(...); DB::transaction(fn() => { $auction = AuctionItem::create($validated); $this->storeAuctionItemPhotos->handle($auction, $files); }); }

If anything is ambiguous, ask for:

- Where to store a new Action or whether it should be a controller update (prefer Action for reused logic).
- Whether endpoints should be Inertia pages or JSON APIs (use JSON when the client is a fetch call with X-Inertia false).
- Any missing CI expectations (tests or required PHP extensions like GD webp).

Thank you — I can iterate on this if you want: add more examples, expand to include testing patterns, or merge with your existing team docs.
