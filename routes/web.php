<?php

use App\Http\Controllers\AuctionItemController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $auctionItems = Auth::user()->auctionItems()->latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'auctionItems' => $auctionItems,
        ]);
    })->name('dashboard');

    Route::resource('auction-items', AuctionItemController::class);
    Route::post('auction-items/{auction_item}/bid', [AuctionItemController::class, 'placeBid'])->name('auction-items.bid');
});

require __DIR__.'/settings.php';
