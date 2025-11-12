import AuctionPreview from '@/components/auction-preview';
import { buttonVariants } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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
}

export default function Dashboard() {
  const { props } = usePage<{
    auctionItems?: DashboardPageProps['auctionItems'];
  }>();
  const auctionItemsList = props.auctionItems ?? [];

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
              <AuctionPreview item={item} />
            ))}
          </div>
        )}
        <div className="relative mt-8 min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </div>
      </div>
    </AppLayout>
  );
}
