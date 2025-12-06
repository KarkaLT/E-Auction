import AuctionGrid from '@/components/auction-grid';
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
        <AuctionGrid
          title={t('auction.wonAuctions')}
          items={wonAuctionsList}
          emptyText={t('auction.noWonAuctions')}
        />
      </div>
    </AppLayout>
  );
}
