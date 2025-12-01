import AuctionPreview from '@/components/auction-preview';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface WonAuctionsPageProps {
  wonAuctions?: Array<{
    id: number;
    title: string;
    starting_price: string;
    current_price?: string | null;
    end_time: string;
    status: string;
  }>;
}

export default function WonAuctions() {
  const { props } = usePage<{
    wonAuctions?: WonAuctionsPageProps['wonAuctions'];
  }>();
  const wonAuctionsList = props.wonAuctions ?? [];

  return (
    <AppLayout>
      <Head title={t('auction.wonAuctions')} />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold">
            {t('auction.wonAuctions')}
          </h2>
        </div>
        {wonAuctionsList.length === 0 && (
          <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t('auction.noWonAuctions')}
          </div>
        )}
        {wonAuctionsList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wonAuctionsList.map((item) => (
              <AuctionPreview key={`won-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
