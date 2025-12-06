<?php

namespace App\Http\Controllers;

use App\Actions\AuctionItems\StoreAuctionItemPhotos;
use App\Models\AuctionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class AuctionItemController extends Controller
{
    public function __construct(private StoreAuctionItemPhotos $storeAuctionItemPhotos)
    {
        // Allow guests to view auction listings and individual auctions.
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // If user is not authenticated, show a public listing of ongoing auctions
        if ($user === null) {
            $auctionItems = AuctionItem::where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->paginate(12);

            return Inertia::render('auction/index', [
                'auctionItems' => $auctionItems,
            ]);
        }

        if (! $user instanceof User) {
            abort(500, 'Authenticated user type mismatch.');
        }

        if ($user->isSeller()) {
            // Show seller's ongoing auctions
            $auctionItems = $user->auctionItems()
                ->where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->paginate(12);
        } elseif ($user->isBuyer()) {
            // Show all ongoing auctions
            $auctionItems = AuctionItem::where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->paginate(12);
        } else {
            // Default: show all ongoing auctions (for admin or other roles)
            $auctionItems = AuctionItem::where('status', 'active')
                ->where('end_time', '>', now())
                ->with('photos')
                ->orderBy('end_time')
                ->paginate(12);
        }

        return Inertia::render('auction/index', [
            'auctionItems' => $auctionItems,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('auction/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:0',
            'bid_increment' => 'required|numeric|min:0',
            'end_time' => 'required|date|after:now',
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpeg,jpg,png,webp,avif|max:5120',
        ]);

        $photos = $request->file('photos', []);
        $photos = is_array($photos) ? array_filter($photos) : array_filter([$photos]);
        $photos = array_values($photos);

        unset($validated['photos']);

        $validated['seller_id'] = Auth::id();

        try {
            $auctionItem = DB::transaction(function () use ($validated, $photos) {
                $auctionItem = AuctionItem::create($validated);

                if (! empty($photos)) {
                    $this->storeAuctionItemPhotos->handle($auctionItem, $photos);
                }

                return $auctionItem;
            });
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withErrors(['photos' => 'We could not process one of the uploaded images. Please try again.'])
                ->withInput();
        }

        return redirect()->route('auction-items.show', $auctionItem);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, AuctionItem $auctionItem)
    {
        $this->authorize('view', $auctionItem); // optional if policy exists
        $auctionItem->load(['seller', 'photos', 'comments.user', 'winner']);

        // Ensure the seller model has a count of how many auction items they created
        if ($auctionItem->seller) {
            $auctionItem->seller->loadCount('auctionItems');
        }

        // Decide whether to render the page within the AppLayout.
        // If the user navigated from seller/buyer pages or settings, render with AppLayout.
        $useAppLayout = false;
        $referer = $request->headers->get('referer');
        if (! empty($referer)) {
            $path = parse_url($referer, PHP_URL_PATH) ?: '';
            if (str_contains($path, '/seller/') || str_contains($path, '/buyer/') || str_contains($path, '/settings')) {
                $useAppLayout = true;
            }
        }

        return Inertia::render('auction/show', [
            'auctionItem' => $auctionItem,
            'useAppLayout' => $useAppLayout,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AuctionItem $auctionItem)
    {
        $this->authorize('update', $auctionItem);

        return Inertia::render('auction/edit', [
            'auctionItem' => $auctionItem,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AuctionItem $auctionItem)
    {
        $this->authorize('update', $auctionItem);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:0',
            'bid_increment' => 'required|numeric|min:0',
            'end_time' => 'required|date|after:now',
        ]);

        $auctionItem->update($validated);

        return redirect()->route('auction-items.show', $auctionItem);
    }

    /**
     * Place a bid on the auction item.
     */
    public function placeBid(Request $request, AuctionItem $auctionItem)
    {
        $user = Auth::user();

        abort_if($user === null, 401);

        // Basic validation
        $validated = $request->validate([
            'bid_amount' => 'required|numeric|min:0',
        ]);

        // Business rules
        if ($auctionItem->seller_id === $user->id) {
            return response()->json(['message' => 'Sellers cannot bid on their own items.'], 403);
        }

        if ($auctionItem->status !== 'active') {
            return response()->json(['message' => 'This auction is not active.'], 422);
        }

        if (Carbon::now()->greaterThanOrEqualTo($auctionItem->end_time)) {
            return response()->json(['message' => 'This auction has already ended.'], 422);
        }

        $currentPrice = $auctionItem->current_price ?? $auctionItem->starting_price;
        $minBid = (float) $currentPrice + (float) $auctionItem->bid_increment;

        $bidAmount = (float) $validated['bid_amount'];

        if ($bidAmount < $minBid) {
            return response()->json(['message' => 'Bid must be at least the minimum bid.', 'min_bid' => $minBid], 422);
        }

        try {
            DB::transaction(function () use ($auctionItem, $bidAmount, $user) {
                // refresh to avoid races
                $auctionItem->refresh();

                // Recalculate current price and min bid to be safe
                $currentPrice = $auctionItem->current_price ?? $auctionItem->starting_price;
                $minBid = (float) $currentPrice + (float) $auctionItem->bid_increment;

                if ($bidAmount < $minBid) {
                    throw new \RuntimeException('Bid too low.');
                }

                $auctionItem->current_price = $bidAmount;
                $auctionItem->winner_id = $user->id;
                $auctionItem->save();
            });
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'Could not place bid. Please try again.'], 500);
        }

        $auctionItem->load(['seller']);

        return response()->json(['auctionItem' => $auctionItem]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuctionItem $auctionItem)
    {
        $this->authorize('delete', $auctionItem);

        $auctionItem->delete();

        return redirect()->route('auction-items.index');
    }
}
