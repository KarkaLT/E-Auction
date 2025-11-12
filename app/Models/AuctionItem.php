<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'end_time' => 'datetime',
        'starting_price' => 'decimal:2',
        'bid_increment' => 'decimal:2',
        'current_price' => 'decimal:2',
    ];

    /**
     * Append convenience attributes when serializing the model.
     * - current_bid: returns the effective current bid (current_price or starting_price)
     * - first_photo: returns the file path (absolute URL) of the first photo if present
     */
    protected $appends = [
        'current_bid',
        'first_photo',
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

    /**
     * Effective current bid to show on listings: prefer current_price, fall back to starting_price.
     */
    public function getCurrentBidAttribute()
    {
        // current_price may be null in the DB
        return $this->current_price !== null
            ? (string) $this->current_price
            : (string) $this->starting_price;
    }

    /**
     * Return first photo file path (using AuctionItemPhoto accessor) or null.
     */
    public function getFirstPhotoAttribute()
    {
        $first = $this->photos->first();

        if (! $first) {
            return null;
        }

        // AuctionItemPhoto has an accessor for file_path that returns an absolute URL
        return $first->file_path;
    }
}
