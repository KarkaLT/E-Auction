import AuctionPreview from '@/components/auction-preview';
import { buttonVariants } from '@/components/ui/button';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type AuctionItem = {
  id: number;
  title: string;
  starting_price: string;
  current_price?: string | null;
  end_time: string;
  status: string;
};

type PageProps = SharedData & {
  auctionItems: {
    data: AuctionItem[];
    current_page: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
};

export default function AuctionIndex() {
  const { props } = usePage<PageProps & SharedData>();
  const { auctionItems, auth } = props as PageProps & SharedData;

  const isAuthenticated = Boolean((auth as { user?: unknown })?.user);
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: isAuthenticated ? t('common.myAuctions') : t('common.auctions'),
      href: '/auction-items',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head
        title={isAuthenticated ? t('common.myAuctions') : t('common.auctions')}
      />
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {isAuthenticated ? t('common.myAuctions') : t('common.auctions')}
          </h1>
          {isAuthenticated && (
            <Link
              href="/auction-items/create"
              className={buttonVariants({ variant: 'default' })}
            >
              {t('auction.createAuction')}
            </Link>
          )}
        </div>
        {auctionItems.data.length === 0 && (
          <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t('auction.noAuctionsYet')}
          </div>
        )}
        {auctionItems.data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctionItems.data.map((item) => (
              <AuctionPreview key={item.id} item={item} />
            ))}
          </div>
        )}
        {/* Simple pagination */}
        {auctionItems.last_page > 1 && (
          <div className="flex flex-wrap gap-2">
            {auctionItems.links.map((link, idx) => (
              <Link
                key={idx}
                href={link.url || '#'}
                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                preserveScroll
              >
                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
