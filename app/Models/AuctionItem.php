<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionItem extends Model
{
    protected $fillable = [
        'seller_id',
        'title',
        'description',
        'starting_price',
        'bid_increment',
        'end_time',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(AuctionItemPhoto::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(AuctionItemComment::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
}
