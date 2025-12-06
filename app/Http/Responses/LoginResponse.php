<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        // Preserve JSON behavior for APIs / fetch
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $user = $request->user();

        // Determine a sensible default based on user role
        $default = Fortify::redirects('login'); // keep a default in case of misconfiguration

        if ($user) {
            if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
                $default = route('admin.users');
            } elseif (method_exists($user, 'isSeller') && $user->isSeller()) {
                $default = route('seller.ongoing-auctions');
            } elseif (method_exists($user, 'isBuyer') && $user->isBuyer()) {
                $default = route('buyer.ongoing-auctions');
            }
        }

        // Use intended if present, otherwise fallback to the role-specific page
        return redirect()->intended($default);
    }
}
