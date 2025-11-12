<?php

namespace App\Console\Commands;

use App\Mail\AuctionSoldMail;
use App\Models\AuctionItem;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class EndExpiredAuctions extends Command
{
    protected $signature = 'auctions:end-expired {--dry : Show what would be changed without saving}';

    protected $description = 'Mark auctions as finished/sold when their end_time has passed';

    public function handle(): int
    {
        $now = Carbon::now();

        $query = AuctionItem::query()
            ->where('status', 'active')
            ->where('end_time', '<=', $now);

        $count = (clone $query)->count();
        if ($count === 0) {
            $this->info('No expired active auctions found.');

            return self::SUCCESS;
        }

        $this->info("Processing {$count} expired active auction(s)...");

        $dryRun = (bool) $this->option('dry');

        $updated = 0;
        $query->chunkById(200, function ($auctions) use (&$updated, $dryRun) {
            $auctions->load('seller', 'winner');
            foreach ($auctions as $auction) {
                $newStatus = $auction->winner_id ? 'sold' : 'finished';

                $this->line(sprintf(
                    '#%d "%s" -> %s',
                    $auction->id,
                    $auction->title,
                    $newStatus
                ));

                if (! $dryRun) {
                    $auction->status = $newStatus;
                    $auction->save();

                    if ($newStatus === 'sold' && $auction->seller && $auction->seller->email) {
                        try {
                            Mail::to($auction->seller->email)->send(new AuctionSoldMail($auction));
                        } catch (\Throwable $e) {
                            $this->error('Failed to send mail for auction #'.$auction->id.': '.$e->getMessage());
                        }
                    }

                    $updated++;
                }
            }
        });

        if ($dryRun) {
            $this->info('Dry run complete. No changes were saved.');
        } else {
            $this->info("Updated {$updated} auction(s).");
        }

        return self::SUCCESS;
    }
}
