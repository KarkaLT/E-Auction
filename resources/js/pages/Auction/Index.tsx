import { buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'My Auctions', href: '/auction-items' },
];

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
  const { props } = usePage<PageProps>();
  const { auctionItems } = props as unknown as PageProps;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Auctions" />
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Auctions</h1>
          <Link
            href="/auction-items/create"
            className={buttonVariants({ variant: 'default' })}
          >
            Create Auction
          </Link>
        </div>
        {auctionItems.data.length === 0 && (
          <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
            You have not created any auctions yet.
          </div>
        )}
        {auctionItems.data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctionItems.data.map((item) => (
              <Link
                key={item.id}
                href={`/auction-items/${item.id}`}
                className="group rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="line-clamp-1 text-base font-medium group-hover:text-primary">
                    {item.title}
                  </h3>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs capitalize">
                    {item.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Start: €{item.starting_price}</p>
                  <p>Current: €{item.current_price ?? item.starting_price}</p>
                  <p className="text-xs">
                    Ends: {new Date(item.end_time).toLocaleString()}
                  </p>
                </div>
              </Link>
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
