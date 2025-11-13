import AuctionPreview from '@/components/auction-preview';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { type AuctionItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Home() {
  const { auctions } = usePage<SharedData>().props as SharedData;
  const auctionsList = (auctions ?? []) as AuctionItem[];

  return (
    <AppLayout>
      <Head title="Home">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>

      {/* Ongoing auctions grid (public) */}
      {auctionsList.length > 0 && (
        <div className="mt-8 w-full">
          <h2 className="mb-4 text-3xl font-semibold text-white">
            {t('auction.ongoingAuctions')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctionsList.map((item) => (
              <AuctionPreview key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="hidden h-14.5 lg:block"></div>
    </AppLayout>
  );
}
