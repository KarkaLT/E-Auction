import { buttonVariants } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import auctionItems from '@/routes/auction-items'; // changed import
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';

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
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
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
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Link
                      href={auctionItems.show(item.id).url}
                      className="line-clamp-1 flex-1 text-base font-medium group-hover:text-primary"
                    >
                      {item.title}
                    </Link>
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
                </div>
                <Form
                  method="post"
                  action={
                    auctionItems.destroy(item.id).url + '?from_dashboard=1'
                  }
                  data-test={`delete-auction-${item.id}`}
                  className="mt-3 flex justify-end"
                  onSubmit={(e) => {
                    if (
                      !confirm('Delete this auction? This cannot be undone.')
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="_method" value="DELETE" />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </Form>
              </div>
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
