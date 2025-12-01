import AuctionPreview from '@/components/auction-preview';
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {t('auction.ongoingAuctions')}
          </h2>
        </div>
        {auctionItemsList.length === 0 && (
          <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t('auction.noActiveAuctions')}
          </div>
        )}
        {auctionItemsList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctionItemsList.map((item) => (
              <AuctionPreview key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
