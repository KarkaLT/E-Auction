<!DOCTYPE html>
<html lang="lt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aukciono daiktas parduotas</title>
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
        <h2>Gera žinia — jūsų daiktas parduotas!</h2>

        <p>Sveiki, {{ optional($auction->seller)->name ?? 'Pardavėjau' }},</p>
        <p>Jūsų aukcionas <strong>„{{ $auction->title }}"</strong> baigėsi ir buvo parduotas {{ optional($auction->winner)->name ?? 'pirkėjui' }}.</p>

        @php
        $price = $auction->current_price ?? $auction->starting_price;
        $priceFormatted = number_format((float) $price, 2);
        @endphp
        <p><strong>Galutinė kaina:</strong> {{ $priceFormatted }} €</p>

        @if($auction->winner && $auction->winner->email)
        <p><strong>Pirkėjo el. paštas:</strong> {{ $auction->winner->email }}</p>
        @endif

        <p class="muted">Aukciono ID: #{{ $auction->id }} · Pasibaigė: {{ $auction->end_time?->format('Y-m-d H:i') }}</p>

        <p>Toliau koordinuokite pristatymą ir mokėjimą su pirkėju.</p>

        <p>Dėkojame, kad naudojate E‑Auction!</p>
    </div>
</body>

</html>
