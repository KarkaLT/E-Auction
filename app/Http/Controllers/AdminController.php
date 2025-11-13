<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function users()
    {
        // Get all users with their auction statistics
        $users = User::withCount([
            'auctionItems as auctions_created_count',
            'wonAuctionItems as items_bought_count' => function ($query) {
                // Count only auctions actually sold to the user
                $query->where('status', 'sold');
            },
        ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'blocked' => (bool) ($user->blocked ?? false),
                    'ip_address' => $user->ip_address,
                    'auctions_created' => $user->auctions_created_count,
                    'items_bought' => $user->items_bought_count,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function block(User $user)
    {
        // Avoid blocking admins for safety
        if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
            abort(403, 'Cannot block an administrator');
        }

        $user->blocked = true;
        $user->save();

        return back()->with('status', 'User blocked');
    }

    public function unblock(User $user)
    {
        $user->blocked = false;
        $user->save();

        return back()->with('status', 'User unblocked');
    }
}
