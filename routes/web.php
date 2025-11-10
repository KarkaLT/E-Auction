<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AuctionItemController;
use Illuminate\Support\Facades\Auth;

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
});

require __DIR__.'/settings.php';
