<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine if the request should be treated as an Inertia request.
     */
    public function shouldHandle(Request $request): bool
    {
        // Skip Inertia handling for API-like endpoints that return JSON
        if ($request->is('settings/sidebar-state')) {
            return false;
        }

        return parent::shouldHandle($request);
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $sidebarOpen = true; // Default value for guests

        if ($user instanceof \App\Models\User) {
            // Use database value for authenticated users (source of truth)
            $sidebarOpen = $user->sidebar_open ?? true;
        } elseif ($request->hasCookie('sidebar_state')) {
            // Only use cookie for guests
            $sidebarOpen = $request->cookie('sidebar_state') === 'true';
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => $sidebarOpen,
        ];
    }
}
