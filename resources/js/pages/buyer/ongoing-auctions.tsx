import AuctionGrid from '@/components/auction-grid';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface OngoingAuctionsPageProps {
  auctionItems?: Array<{
    id: number;
    title: string;
    starting_price: string;
    current_price?: string | null;
    end_time: string;
    status: string;
  }>;
}

export default function OngoingAuctions() {
  const { props } = usePage<{
    auctionItems?: OngoingAuctionsPageProps['auctionItems'];
  }>();
  const auctionItemsList = props.auctionItems ?? [];

  return (
    <AppLayout>
      <Head title={t('auction.ongoingAuctions')} />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <AuctionGrid
          title={t('auction.ongoingAuctions')}
          items={auctionItemsList}
          emptyText={t('auction.noActiveAuctions')}
        />
      </div>
    </AppLayout>
  );
}
