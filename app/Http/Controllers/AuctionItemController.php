<?php

namespace App\Http\Controllers;

use App\Actions\AuctionItems\StoreAuctionItemPhotos;
use App\Models\AuctionItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class AuctionItemController extends Controller
{
    public function __construct(private StoreAuctionItemPhotos $storeAuctionItemPhotos)
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        abort_if($user === null, 401);
        if (! $user instanceof User) {
            abort(500, 'Authenticated user type mismatch.');
        }

        $auctionItems = $user->auctionItems()->latest()->paginate(10);
        return Inertia::render('Auction/Index', [
            'auctionItems' => $auctionItems,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Auction/Create');
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
            'photos.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120',
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
    public function show(AuctionItem $auctionItem)
    {
        $this->authorize('view', $auctionItem); // optional if policy exists
        $auctionItem->load(['seller']);
        return Inertia::render('Auction/Show', [
            'auctionItem' => $auctionItem,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AuctionItem $auctionItem)
    {
        $this->authorize('update', $auctionItem);

        return Inertia::render('Auction/Edit', [
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
     * Remove the specified resource from storage.
     */
    public function destroy(AuctionItem $auctionItem)
    {
        $this->authorize('delete', $auctionItem);

        $auctionItem->delete();

        if (request()->boolean('from_dashboard')) {
            return redirect()->route('dashboard');
        }

        return redirect()->route('auction-items.index');
    }
}
