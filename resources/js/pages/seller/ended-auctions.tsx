import AuctionGrid from '@/components/auction-grid';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface EndedAuctionsPageProps {
  auctionItems?: Array<{
    id: number;
    title: string;
    starting_price: string;
    current_price?: string | null;
    end_time: string;
    status: string;
  }>;
}

export default function EndedAuctions() {
  const { props } = usePage<{
    auctionItems?: EndedAuctionsPageProps['auctionItems'];
  }>();
  const auctionItemsList = props.auctionItems ?? [];

  return (
    <AppLayout>
      <Head title={t('auction.endedAuctions')} />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <AuctionGrid
          title={t('auction.endedAuctions')}
          items={auctionItemsList}
          emptyText={t('auction.noEndedAuctions')}
        />
      </div>
    </AppLayout>
  );
}
