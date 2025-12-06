<?php

use App\Http\Controllers\AuctionItemController;
use App\Models\AuctionItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/logout', function () {
    Auth::logout();

    return redirect('/login');
})->name('logout');

Route::middleware('auth')->group(function () {
    // Redirect the root path to auction item listing — home page removed
    Route::get('/', function () {
        return redirect()->route('auction-items.index');
    });
    // Important: Register the authenticated resource routes BEFORE the public "show" route.
    // Otherwise, the "/auction-items/{auction_item}" route can shadow "/auction-items/create"
    // and cause a 404 by attempting to resolve "create" as a model id.
    Route::middleware(['auth', 'not-blocked'])->group(function () {
        // Comments for auction items - any authenticated user can comment
        Route::post('auction-items/{auction_item}/comments', [\App\Http\Controllers\AuctionItemCommentController::class, 'store'])->name('auction-items.comments.store');
    });

    // Seller-only routes
    Route::middleware(['auth', 'not-blocked', 'seller'])->group(function () {
        Route::get('seller/ongoing-auctions', function () {
            $user = Auth::user();

            if (! $user instanceof \App\Models\User) {
                abort(500, 'Authenticated user type mismatch.');
            }

            // Ongoing auctions (active and end_time in the future)
            $auctionItems = $user->auctionItems()
                ->where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->get();

            return Inertia::render('seller/ongoing-auctions', [
                'auctionItems' => $auctionItems,
            ]);
        })->name('seller.ongoing-auctions');

        Route::get('seller/ended-auctions', function () {
            $user = Auth::user();

            if (! $user instanceof \App\Models\User) {
                abort(500, 'Authenticated user type mismatch.');
            }

            // Ended auctions (sold, cancelled, or expired)
            $auctionItems = $user->auctionItems()
                ->whereIn('status', ['sold', 'cancelled', 'expired'])
                ->orWhere(function ($query) use ($user) {
                    $query->where('seller_id', $user->id)
                        ->where('end_time', '<=', now());
                })
                ->with('photos')
                ->orderByDesc('end_time')
                ->get();

            return Inertia::render('seller/ended-auctions', [
                'auctionItems' => $auctionItems,
            ]);
        })->name('seller.ended-auctions');

        // All mutating auction routes (create/store/edit/update/destroy) for sellers
        Route::resource('auction-items', AuctionItemController::class)->except(['index', 'show']);
    });

    // Buyer routes - can place bids
    Route::middleware(['auth', 'not-blocked'])->group(function () {
        Route::post('auction-items/{auction_item}/bid', [AuctionItemController::class, 'placeBid'])->name('auction-items.bid');

        Route::get('buyer/ongoing-auctions', function () {
            // All ongoing auctions (active and end_time in the future)
            $auctionItems = AuctionItem::where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->get();

            return Inertia::render('buyer/ongoing-auctions', [
                'auctionItems' => $auctionItems,
            ]);
        })->name('buyer.ongoing-auctions');

        Route::get('buyer/won-auctions', function () {
            $user = Auth::user();

            if (! $user instanceof \App\Models\User) {
                abort(500, 'Authenticated user type mismatch.');
            }

            // Auctions the user has won
            $wonAuctions = AuctionItem::where('winner_id', $user->id)
                ->with('photos')
                ->where('status', 'sold')
                ->whereNotNull('winner_id')
                ->orderByDesc('end_time')
                ->get();

            return Inertia::render('buyer/won-auctions', [
                'wonAuctions' => $wonAuctions,
            ]);
        })->name('buyer.won-auctions');
    }); // Admin routes
    Route::middleware(['auth', 'not-blocked', 'admin'])->group(function () {
        Route::get('admin/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('admin.users');
        Route::post('admin/users/{user}/block', [\App\Http\Controllers\AdminController::class, 'block'])->name('admin.users.block');
        Route::post('admin/users/{user}/unblock', [\App\Http\Controllers\AdminController::class, 'unblock'])->name('admin.users.unblock');
    }); // Publicly viewable auction routes (index & show)
    Route::resource('auction-items', AuctionItemController::class)->only(['index', 'show']);
});

require __DIR__.'/settings.php';
