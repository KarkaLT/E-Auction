import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import VisuallyHidden from '@/components/ui/visually-hidden';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { formatLocalDateTime } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AuctionItemPhoto {
  id: number;
  file_path: string;
}

interface AuctionItemComment {
  id: number;
  body: string;
  user?: { id: number; name: string } | null;
  created_at?: string | null;
}

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
  winner?: { id: number; name: string } | null;
  photos?: AuctionItemPhoto[];
  comments?: AuctionItemComment[];
}

type PageProps = SharedData & {
  auctionItem: AuctionItem;
  useAppLayout?: boolean;
};

export default function AuctionShow() {
  const { props } = usePage<PageProps>();
  const { auctionItem, auth } = props as PageProps;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AuctionItemPhoto | null>(
    null,
  );

  // Comments state
  const [comments, setComments] = useState<AuctionItemComment[]>(
    auctionItem.comments ?? [],
  );
  const [newCommentBody, setNewCommentBody] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Auctions', href: '/auction-items' },
    { title: auctionItem.title, href: `/auction-items/${auctionItem.id}` },
  ];

  const currentPrice = auctionItem.current_price ?? auctionItem.starting_price;
  // Bid amount state and helpers (must be declared after currentPrice)
  const parsedBidIncrement = parseFloat(auctionItem.bid_increment || '0');
  const minBid =
    parseFloat(currentPrice) +
    (isNaN(parsedBidIncrement) ? 0 : parsedBidIncrement);
  const [bidAmount, setBidAmount] = useState<number>(() =>
    parseFloat(minBid.toFixed(2)),
  );
  const [placingBid, setPlacingBid] = useState(false);

  // Disable placing bid if the current authenticated user is the seller/creator
  const isSeller = auth?.user?.id === auctionItem.seller?.id;
  // Logged in check
  const isLoggedIn = Boolean(auth?.user);

  const formattedEndTime = formatLocalDateTime(auctionItem.end_time);

  const getInitials = useInitials();

  const pageContent = (
    <>
      <Head title={auctionItem.title} />
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{auctionItem.title}</h1>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5">
            {auctionItem.status.charAt(0).toUpperCase() +
              auctionItem.status.slice(1)}
          </Badge>
        </div>

        {/* Carousel */}
        <div className="mb-8">
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {auctionItem.photos!.map((photo) => (
                <CarouselItem
                  key={photo.id}
                  className="basis-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="aspect-3/4 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={photo.file_path}
                      alt={`${auctionItem.title} photo ${photo.id}`}
                      className="h-full w-full cursor-pointer object-cover transition-transform duration-150 hover:scale-105"
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setPreviewOpen(true);
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Bottom Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Seller Card */}
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
              <Avatar className="size-16">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${auctionItem.seller?.name}`}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {auctionItem.seller?.name
                    ? getInitials(auctionItem.seller.name)
                    : 'YO'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Seller</p>
                <p className="text-lg font-semibold">
                  {auctionItem.seller?.name ?? 'You'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Bid Card */}
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Current Bid
                </p>
                <p className="text-4xl font-bold">
                  $
                  {parseFloat(currentPrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="h-px w-full bg-destructive/50" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Auction End. {formattedEndTime}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bid Increment Card (or Winner when auction ended) */}
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
              {auctionItem.status !== 'active' ? (
                <div className="w-full">
                  {auctionItem.winner ? (
                    <>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Winner
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <Avatar className="size-12">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${auctionItem.winner.name}`}
                          />
                          <AvatarFallback className="text-lg font-semibold">
                            {getInitials(auctionItem.winner.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-lg font-semibold">
                            {auctionItem.winner.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Final price: $
                            {parseFloat(currentPrice).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 text-center">
                      <p className="text-lg font-semibold">No winner</p>
                      <p className="text-sm text-muted-foreground">
                        Final price: $
                        {parseFloat(currentPrice).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">
                    Auction ended. {formattedEndTime}
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <p className="mb-2 text-sm text-muted-foreground">Your Bid</p>

                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      type="button"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-white text-lg shadow-sm disabled:opacity-50"
                      onClick={() => {
                        setBidAmount((prev) => {
                          const next = parseFloat(
                            (prev - parsedBidIncrement).toFixed(2),
                          );
                          return next >= minBid ? next : minBid;
                        });
                      }}
                      disabled={bidAmount <= minBid + Number.EPSILON}
                      aria-label="Decrease bid"
                    >
                      −
                    </Button>

                    <Input
                      type="number"
                      className="h-10 w-36 rounded-md border bg-muted/10 px-3 py-2 text-center text-lg text-white"
                      value={bidAmount}
                      readOnly
                      aria-label="Bid amount"
                    />

                    <Button
                      type="button"
                      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-white text-lg shadow-sm"
                      onClick={() => {
                        setBidAmount((prev) =>
                          parseFloat((prev + parsedBidIncrement).toFixed(2)),
                        );
                      }}
                      aria-label="Increase bid"
                    >
                      +
                    </Button>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Minimum bid: $
                    {parseFloat(minBid.toFixed(2)).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Increment: ${parsedBidIncrement.toFixed(2)}
                  </p>
                  <div className="mt-4 flex flex-col items-center">
                    <Button
                      type="button"
                      className="w-44 cursor-pointer select-none"
                      onClick={() => {
                        const placeBid = async () => {
                          try {
                            setPlacingBid(true);

                            const token = document
                              .querySelector('meta[name="csrf-token"]')
                              ?.getAttribute('content');

                            const res = await fetch(
                              `/auction-items/${auctionItem.id}/bid`,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Accept: 'application/json',
                                  'X-CSRF-TOKEN': token ?? '',
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                  bid_amount: bidAmount,
                                }),
                              },
                            );

                            if (!res.ok) {
                              const body = await res.json().catch(() => ({}));
                              // TODO: show nicer UI error; for now log and return
                              console.error('Bid failed', body);
                              return;
                            }

                            // Refresh the page so Inertia fetches updated auctionItem props
                            router.reload();
                          } finally {
                            setPlacingBid(false);
                          }
                        };

                        placeBid();
                      }}
                      disabled={placingBid || isSeller || !isLoggedIn}
                    >
                      {!isLoggedIn
                        ? 'You need to be logged in'
                        : isSeller
                          ? 'Cannot bid on your item'
                          : placingBid
                            ? 'Placing…'
                            : 'Place bid'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Description Card */}
          <Card className="border-0 bg-muted/50 md:col-span-3">
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-semibold">Description</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {auctionItem.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments Card */}
          <Card className="border-0 bg-muted/50 md:col-span-3">
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-semibold">Comments</h2>

              {/* Add comment form above the comments list */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  Add a comment
                </p>

                <textarea
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                  className="min-h-20 w-full rounded-md border bg-muted/10 px-3 py-2 text-sm text-white"
                  placeholder={
                    isLoggedIn
                      ? 'Write your comment...'
                      : 'Log in to post comments'
                  }
                  disabled={!isLoggedIn}
                />

                <div className="mt-3 flex items-center justify-end">
                  <Button
                    type="button"
                    className="w-40"
                    onClick={() => {
                      const postComment = async () => {
                        try {
                          setPostingComment(true);

                          const token = document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content');

                          const res = await fetch(
                            `/auction-items/${auctionItem.id}/comments`,
                            {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                'X-CSRF-TOKEN': token ?? '',
                              },
                              credentials: 'same-origin',
                              body: JSON.stringify({ body: newCommentBody }),
                            },
                          );

                          if (!res.ok) {
                            const body = await res.json().catch(() => ({}));
                            console.error('Comment failed', body);
                            return;
                          }

                          // Try to read created comment and append optimistically
                          const created = await res.json().catch(() => null);
                          if (created && created.id) {
                            setComments((prev) => [
                              created as AuctionItemComment,
                              ...prev,
                            ]);
                            setNewCommentBody('');
                          } else {
                            // Fallback: reload page so server returns updated props
                            router.reload();
                          }
                        } finally {
                          setPostingComment(false);
                        }
                      };

                      postComment();
                    }}
                    disabled={
                      !isLoggedIn ||
                      postingComment ||
                      newCommentBody.trim() === ''
                    }
                  >
                    {!isLoggedIn
                      ? 'Log in to comment'
                      : postingComment
                        ? 'Posting…'
                        : 'Post comment'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex space-x-4">
                      <Avatar className="mt-1 size-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.name ?? 'User'}`}
                        />
                        <AvatarFallback className="text-sm font-semibold">
                          {getInitials(c.user?.name ?? 'User')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-semibold">
                            {c.user?.name ?? 'Anonymous'}
                          </p>
                          {c.created_at && (
                            <p className="text-xs text-muted-foreground">
                              {formatLocalDateTime(c.created_at)}
                            </p>
                          )}
                        </div>
                        <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="min-w-full">
          {/* DialogTitle is required for accessibility; hide it visually for
              sighted users by wrapping it with VisuallyHidden. */}
          <DialogTitle>
            <VisuallyHidden>Image preview</VisuallyHidden>
          </DialogTitle>
          <DialogClose asChild>
            {selectedPhoto && (
              <img
                src={selectedPhoto.file_path}
                alt={`${auctionItem.title} preview`}
                className="rounded-lg object-contain"
              />
            )}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );

  // Always render auction show with the app layout so the bundled AppHeader is present.
  return <AppLayout breadcrumbs={breadcrumbs}>{pageContent}</AppLayout>;
}
