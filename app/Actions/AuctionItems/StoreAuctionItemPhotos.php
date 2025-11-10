<?php

namespace App\Actions\AuctionItems;

use App\Models\AuctionItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class StoreAuctionItemPhotos
{
    /**
     * Persist uploaded photos for an auction item after converting them to WebP.
     *
     * @param array<int, UploadedFile|null> $photos
     */
    public function handle(AuctionItem $auctionItem, array $photos): void
    {
        $normalizedPhotos = array_values(array_filter($photos, static fn($file) => $file instanceof UploadedFile));

        if ($normalizedPhotos === []) {
            return;
        }

        $storedFilePaths = [];

        try {
            DB::transaction(function () use ($normalizedPhotos, $auctionItem, &$storedFilePaths) {
                foreach ($normalizedPhotos as $photo) {
                    $webpContents = $this->encodeToWebp($photo);

                    $fileName = Str::uuid()->toString() . '.webp';
                    $filePath = "auction-photos/{$fileName}";

                    $stored = Storage::disk('public')->put($filePath, $webpContents);

                    if (! $stored) {
                        throw new RuntimeException('Failed to store converted image.');
                    }

                    $storedFilePaths[] = $filePath;

                    $auctionItem->photos()->create(['file_path' => $filePath]);
                }
            });
        } catch (Throwable $exception) {
            foreach ($storedFilePaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $exception;
        }
    }

    private function encodeToWebp(UploadedFile $photo): string
    {
        if (! function_exists('imagewebp')) {
            throw new RuntimeException('Image conversion not available. The GD extension with WebP support is required.');
        }

        $imageContents = $photo->get();

        $image = imagecreatefromstring($imageContents);

        if ($image === false) {
            throw new RuntimeException('Unable to read uploaded image.');
        }

        if (function_exists('imagepalettetotruecolor')) {
            $isTrueColor = function_exists('imageistruecolor') ? imageistruecolor($image) : true;

            if (! $isTrueColor) {
                imagepalettetotruecolor($image);
            }
        }

        if (function_exists('imagealphablending')) {
            imagealphablending($image, true);
        }

        if (function_exists('imagesavealpha')) {
            imagesavealpha($image, true);
        }

        ob_start();
        $encoded = imagewebp($image, null, 80);
        $webpData = ob_get_clean();
        imagedestroy($image);

        if (! $encoded || $webpData === false || $webpData === '') {
            throw new RuntimeException('Failed to convert image to WebP format.');
        }

        return $webpData;
    }
}
