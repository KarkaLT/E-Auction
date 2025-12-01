<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SidebarStateController extends Controller
{
    /**
     * Update the sidebar state for the authenticated user.
     */
    public function update(Request $request)
    {
        $request->validate([
            'sidebar_open' => 'required|boolean',
        ]);

        $user = Auth::user();

        if ($user instanceof \App\Models\User) {
            $user->sidebar_open = $request->boolean('sidebar_open');
            $user->save();
        }

        return response()->json(['success' => true]);
    }
}
