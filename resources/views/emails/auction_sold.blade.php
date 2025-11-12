<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Item Sold</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
            color: #111827;
        }

        .container {
            max-width: 640px;
            margin: 0 auto;
            padding: 24px;
        }

        .btn {
            display: inline-block;
            background: #2563eb;
            color: #fff;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 6px;
        }

        .muted {
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Good news — your item was sold!</h2>

        <p>Hi {{ optional($auction->seller)->name ?? 'Seller' }},</p>
        <p>Your auction <strong>“{{ $auction->title }}”</strong> has ended and was sold to {{ optional($auction->winner)->name ?? 'a buyer' }}.</p>

        @php
        $price = $auction->current_price ?? $auction->starting_price;
        $priceFormatted = number_format((float) $price, 2);
        @endphp
        <p><strong>Final price:</strong> {{ $priceFormatted }}</p>

        @if($auction->winner && $auction->winner->email)
        <p><strong>Buyer email:</strong> {{ $auction->winner->email }}</p>
        @endif

        <p class="muted">Auction ID: #{{ $auction->id }} · Ended at: {{ $auction->end_time?->format('Y-m-d H:i') }}</p>

        <p>Next, coordinate delivery and payment with the buyer. If your platform supports it, you can manage fulfillment in your dashboard.</p>

        <p>Thanks for using E‑Auction!</p>
    </div>
</body>

</html>