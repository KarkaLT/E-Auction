<?php

namespace App\Policies;

use App\Models\AuctionItem;
use App\Models\User;

class AuctionItemPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        // Anyone (including guests) may view listings
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, AuctionItem $auctionItem): bool
    {
        // Allow viewing by any user or guest. Keep model-level restrictions here if needed later.
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AuctionItem $auctionItem): bool
    {
        return $user->id === $auctionItem->seller_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AuctionItem $auctionItem): bool
    {
        return $user->id === $auctionItem->seller_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AuctionItem $auctionItem): bool
    {
        return $user->id === $auctionItem->seller_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AuctionItem $auctionItem): bool
    {
        return $user->id === $auctionItem->seller_id;
    }
}
