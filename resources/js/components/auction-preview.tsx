import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { t } from '@/i18n';
import { formatEndTime } from '@/lib/utils';
import { type AuctionItem } from '@/types';
import { Link } from '@inertiajs/react';

export default function AuctionPreview({
  item,
  className = '',
  link = true,
}: {
  item: AuctionItem;
  className?: string;
  link?: boolean;
}) {
  const price = item.current_bid ?? item.current_price ?? item.starting_price;

  // Format numeric string to localized euro amount if possible
  let priceDisplay = price;
  const n = Number(price);
  if (!Number.isNaN(n)) {
    priceDisplay = n.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }

  // keep `group` so nested `group-hover` styles (title) still work
  const wrapperClass = `group transition hover:shadow-md w-100 h-90 ${className}`;

  // Wrap the card in a Link by default so clicking the card opens the auction page.
  // Consumers can pass `link={false}` to render without navigation wrapper.
  const CardInner = (
    <Card className={wrapperClass} role="article">
      {/* Image should span the full card width. Card has vertical padding (py-6),
            so pull the image up with negative margin to reach the card edge. */}
      <div className="-mt-6 overflow-hidden rounded-t-xl bg-muted">
        <img
          src={item.first_photo ?? '/storage/placeholder.png'}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="mb-2 flex flex-row items-center">
        <h3 className="line-clamp-1 text-2xl font-medium group-hover:text-primary">
          {item.title}
        </h3>
        <div className="flex-1" />
        <Badge
          variant="secondary"
          className="rounded-full px-4 py-1.5 capitalize"
        >
          {item.status}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-row items-center space-y-1 text-sm text-muted-foreground">
        <span>{t('auction.currentBid')}:</span>
        <div className="flex-1" />
        <span>{priceDisplay}€</span>
      </CardContent>

      <CardFooter className="text-xs">
        {t('auction.ends')}: {formatEndTime(item.end_time)}
      </CardFooter>
    </Card>
  );

  if (link === false) {
    return CardInner;
  }

  return (
    <Link href={`/auction-items/${item.id}`} className="no-underline">
      {CardInner}
    </Link>
  );
}
