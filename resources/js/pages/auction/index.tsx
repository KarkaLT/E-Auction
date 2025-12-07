import AuctionGrid from '@/components/auction-grid';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { type AuctionItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
  const { props } = usePage<{
    auctionItems?: AuctionItem[] | { data: AuctionItem[] };
  }>();
  const auctionItemsProp = props.auctionItems;
  const items: AuctionItem[] = Array.isArray(auctionItemsProp)
    ? auctionItemsProp
    : (auctionItemsProp?.data ?? []);

  return (
    <AppLayout>
      <Head title={t('auction.ongoingAuctions')} />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <AuctionGrid
          title={t('auction.ongoingAuctions')}
          items={items}
          emptyText={t('auction.noAuctionsYet')}
        />
      </div>
    </AppLayout>
  );
}
