<?php

namespace App\Http\Controllers;

use App\Actions\AuctionItems\StoreAuctionItemPhotos;
use App\Models\AuctionItem;
use App\Models\AuctionItemPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AuctionItemPhotoController extends Controller
{
    public function __construct(private StoreAuctionItemPhotos $storeAuctionItemPhotos) {}

    public function store(Request $request, AuctionItem $auctionItem)
    {
        $this->authorize('update', $auctionItem);

        $request->validate([
            'photos' => 'required|array|min:1',
            'photos.*' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $photos = $request->file('photos', []);

        if (! is_array($photos)) {
            $photos = [$photos];
        }

        try {
            $this->storeAuctionItemPhotos->handle($auctionItem, $photos);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withErrors(['photos' => 'We could not process one of the uploaded images. Please try again.'])
                ->withInput();
        }

        return back()->with('success', 'Photos uploaded successfully.');
    }

    public function destroy(AuctionItemPhoto $photo)
    {
        $auctionItem = $photo->auctionItem;
        $this->authorize('update', $auctionItem);

        // Use the original stored path for deletion (avoid deleting by absolute URL)
        $storedPath = $photo->getOriginal('file_path') ?? $photo->file_path;
        Storage::disk('public')->delete($storedPath);
        $photo->delete();

        return back()->with('success', 'Photo deleted successfully.');
    }
}
