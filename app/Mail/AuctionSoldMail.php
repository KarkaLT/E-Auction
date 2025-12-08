<?php

namespace App\Mail;

use App\Models\AuctionItem;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionSoldMail extends Mailable
{
    use Queueable, SerializesModels;

    public AuctionItem $auction;

    public function __construct(AuctionItem $auction)
    {
        $this->auction = $auction;
    }

    public function build(): self
    {
        return $this
            ->subject('Jūsų aukciono prekė buvo parduota')
            ->view('emails.auction_sold');
    }
}
