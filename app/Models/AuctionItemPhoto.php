<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionItemPhoto extends Model
{
    protected $fillable = [
        'auction_item_id',
        'file_path',
    ];

    public function auctionItem(): BelongsTo
    {
        return $this->belongsTo(AuctionItem::class);
    }

    /**
     * Return an absolute URL for the file path.
     * If the stored value is already an absolute URL, return as-is.
     * Otherwise, build a URL using the current request's scheme+host when
     * available, falling back to the app.url config value.
     *
     * This ensures API responses return full URLs that the frontend can
     * consume directly.
     */
    public function getFilePathAttribute($value)
    {
        if (empty($value)) {
            return $value;
        }

        if (preg_match('/^https?:\/\//i', $value)) {
            return $value;
        }

        // Try to detect the current request host/scheme first
        $host = null;
        try {
            if (function_exists('request') && request()) {
                $host = request()->getSchemeAndHttpHost();
            }
        } catch (\Throwable $e) {
            $host = null;
        }

        if (empty($host)) {
            // Fallback to app.url (from .env APP_URL) or url('/')
            $host = config('app.url') ?: url('/');
        }

        // If the stored path already points under storage/, expose it as
        // /storage/<path>. Otherwise prefix with /storage/ so the public URL
        // points to the file served from the storage symlink.
        if (str_starts_with($value, 'storage/') || str_starts_with($value, '/storage/')) {
            return rtrim($host, '/').'/'.ltrim($value, '/');
        }

        return rtrim($host, '/').'/storage/'.ltrim($value, '/');
    }
}
