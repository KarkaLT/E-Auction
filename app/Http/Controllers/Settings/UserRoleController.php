<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserRoleController extends Controller
{
    /**
     * Update the user's role.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['user', 'admin', 'seller', 'buyer'])],
        ]);

        if ($validated['role'] === 'admin' && ! $request->user()->canBeAdmin()) {
            abort(403, 'You are not authorized to switch to the admin role.');
        }

        $request->user()->update([
            'role' => $validated['role'],
        ]);

        // Redirect to appropriate dashboard based on role
        return match ($validated['role']) {
            'admin' => redirect()->route('admin.users'),
            'seller' => redirect()->route('dashboard'),
            'buyer' => redirect()->route('home'),
            default => redirect()->route('home'),
        };
    }
}
