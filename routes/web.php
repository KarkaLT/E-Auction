<?php

use App\Http\Controllers\AuctionItemController;
use App\Models\AuctionItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // Fetch current ongoing auctions: active status and end_time in the future
    $auctions = AuctionItem::where('status', 'active')
        ->where('end_time', '>', now())
        ->with('photos')
        ->orderBy('end_time')
        ->get();

    return Inertia::render('home', [
        'canRegister' => Features::enabled(Features::registration()),
        'auctions' => $auctions,
    ]);
})->name('home');
// Important: Register the authenticated resource routes BEFORE the public "show" route.
// Otherwise, the "/auction-items/{auction_item}" route can shadow "/auction-items/create"
// and cause a 404 by attempting to resolve "create" as a model id.
Route::middleware(['auth', 'not-blocked'])->group(function () {
    // Comments for auction items - any authenticated user can comment
    Route::post('auction-items/{auction_item}/comments', [\App\Http\Controllers\AuctionItemCommentController::class, 'store'])->name('auction-items.comments.store');
});

// Seller-only routes
Route::middleware(['auth', 'not-blocked', 'seller'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        if (! $user instanceof \App\Models\User) {
            abort(500, 'Authenticated user type mismatch.');
        }

        // Recent auctions created by the user
        $auctionItems = $user->auctionItems()->latest()->take(5)->get();

        // Recent auctions the user has won
        $wonAuctions = AuctionItem::where('winner_id', $user->id)
            ->with('photos')
            ->where('status', 'sold')
            ->whereNotNull('winner_id')
            ->orderByDesc('end_time')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'auctionItems' => $auctionItems,
            'wonAuctions' => $wonAuctions,
        ]);
    })->name('dashboard');

    // All mutating auction routes (create/store/edit/update/destroy) for sellers
    Route::resource('auction-items', AuctionItemController::class)->except(['index', 'show']);
});

// Buyer routes - can place bids
Route::middleware(['auth', 'not-blocked'])->group(function () {
    Route::post('auction-items/{auction_item}/bid', [AuctionItemController::class, 'placeBid'])->name('auction-items.bid');
});

// Admin routes
Route::middleware(['auth', 'not-blocked', 'admin'])->group(function () {
    Route::get('admin/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('admin.users');
    Route::post('admin/users/{user}/block', [\App\Http\Controllers\AdminController::class, 'block'])->name('admin.users.block');
    Route::post('admin/users/{user}/unblock', [\App\Http\Controllers\AdminController::class, 'unblock'])->name('admin.users.unblock');
}); // Publicly viewable auction routes (index & show)
Route::resource('auction-items', AuctionItemController::class)->only(['index', 'show']);

require __DIR__.'/settings.php';
