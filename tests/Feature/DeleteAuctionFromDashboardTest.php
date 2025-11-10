<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\AuctionItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class DeleteAuctionFromDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_own_auction_from_dashboard(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $auction = AuctionItem::create([
            'seller_id' => $user->id,
            'title' => 'Test Auction',
            'description' => 'Desc',
            'starting_price' => 10.00,
            'bid_increment' => 1.00,
            'end_time' => now()->addDay(),
        ]);

        $this->assertDatabaseHas('auction_items', ['id' => $auction->id]);

        $response = $this->delete(route('auction-items.destroy', $auction) . '?from_dashboard=1');
        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseMissing('auction_items', ['id' => $auction->id]);
    }

    public function test_user_cannot_delete_others_auction(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $auction = AuctionItem::create([
            'seller_id' => $userA->id,
            'title' => 'Test Auction',
            'description' => 'Desc',
            'starting_price' => 10.00,
            'bid_increment' => 1.00,
            'end_time' => now()->addDay(),
        ]);

        $this->actingAs($userB);
        $response = $this->delete(route('auction-items.destroy', $auction) . '?from_dashboard=1');
        $response->assertStatus(403);
        $this->assertDatabaseHas('auction_items', ['id' => $auction->id]);
    }
}

