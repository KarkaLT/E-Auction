import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { type SharedData, type BreadcrumbItem } from '@/types';

interface AuctionItem {
  id: number;
  title: string;
  description: string;
  starting_price: string;
  current_price?: string | null;
  bid_increment: string;
  end_time: string;
  status: string;
  seller?: { id: number; name: string };
}

type PageProps = SharedData & { auctionItem: AuctionItem };

export default function AuctionShow() {
  const { props } = usePage<PageProps>();
  const { auctionItem } = props as PageProps;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Auctions', href: '/auction-items' },
    { title: auctionItem.title, href: `/auction-items/${auctionItem.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={auctionItem.title} />
      <div className="p-4 space-y-6 md:max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{auctionItem.title}</h1>
          <Link href="/auction-items" className={buttonVariants({ variant: 'secondary' })}>Back</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Seller: {auctionItem.seller?.name ?? 'You'}</p>
            <p className="text-sm">Status: <span className="capitalize">{auctionItem.status}</span></p>
            <p className="text-sm">Starting Price: €{auctionItem.starting_price}</p>
            <p className="text-sm">Current Price: €{auctionItem.current_price ?? auctionItem.starting_price}</p>
            <p className="text-sm">Bid Increment: €{auctionItem.bid_increment}</p>
            <p className="text-sm">Ends: {new Date(auctionItem.end_time).toLocaleString()}</p>
          </div>
        </div>
        <div className="prose max-w-none dark:prose-invert">
          <p>{auctionItem.description}</p>
        </div>
      </div>
    </AppLayout>
  );
}
