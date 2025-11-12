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
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $auctionItems = Auth::user()->auctionItems()->latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'auctionItems' => $auctionItems,
        ]);
    })->name('dashboard');

    // All mutating auction routes (create/store/edit/update/destroy) and bidding remain protected
    Route::resource('auction-items', AuctionItemController::class)->except(['index', 'show']);
    Route::post('auction-items/{auction_item}/bid', [AuctionItemController::class, 'placeBid'])->name('auction-items.bid');
    // Comments for auction items
    Route::post('auction-items/{auction_item}/comments', [\App\Http\Controllers\AuctionItemCommentController::class, 'store'])->name('auction-items.comments.store');
});

// Publicly viewable auction routes (index & show)
Route::resource('auction-items', AuctionItemController::class)->only(['index', 'show']);

require __DIR__.'/settings.php';
