import AuctionPreview from '@/components/auction-preview';
import { buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import auctionItems from '@/routes/auction-items'; // changed import
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

interface DashboardPageProps {
  auctionItems?: Array<{
    id: number;
    title: string;
    starting_price: string;
    current_price?: string | null;
    end_time: string;
    status: string;
  }>;
  wonAuctions?: Array<{
    id: number;
    title: string;
    starting_price: string;
    current_price?: string | null;
    end_time: string;
    status: string;
  }>;
}

export default function Dashboard() {
  const { props } = usePage<{
    auctionItems?: DashboardPageProps['auctionItems'];
    wonAuctions?: DashboardPageProps['wonAuctions'];
  }>();
  const auctionItemsList = props.auctionItems ?? [];
  const wonAuctionsList = props.wonAuctions ?? [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Recent Auctions</h2>
          <Link
            href={auctionItems.create().url}
            className={buttonVariants({ variant: 'default' })}
          >
            Create Auction
          </Link>
        </div>
        {auctionItemsList.length === 0 && (
          <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            You have not created any auctions yet.
          </div>
        )}
        {auctionItemsList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctionItemsList.map((item) => (
              <AuctionPreview key={item.id} item={item} />
            ))}
          </div>
        )}
        {wonAuctionsList.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Recently Won Auctions
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wonAuctionsList.map((item) => (
                <AuctionPreview key={`won-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
