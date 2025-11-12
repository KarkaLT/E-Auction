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
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AuctionItemPhoto {
  id: number;
  file_path: string;
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
  photos?: AuctionItemPhoto[];
}

type PageProps = SharedData & { auctionItem: AuctionItem };

export default function AuctionShow() {
  const { props } = usePage<PageProps>();
  const { auctionItem } = props as PageProps;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AuctionItemPhoto | null>(
    null,
  );

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

  const formattedEndTime = new Date(auctionItem.end_time).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  const getSellerInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={auctionItem.title} />
      <div className="p-6 md:p-10">
        <Card className="mx-auto max-w-7xl">
          <CardContent className="p-8 md:p-12">
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
                        ? getSellerInitials(auctionItem.seller.name)
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

              {/* Bid Increment Card */}
              <Card className="border-0 bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="w-full">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Your Bid
                    </p>

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
                        className="w-40 cursor-pointer select-none"
                        onClick={() => {
                          // Intentionally do not call API yet. Local-only action for now.

                          console.log(
                            'Place bid clicked (local only):',
                            bidAmount,
                          );
                        }}
                      >
                        Place bid
                      </Button>
                    </div>
                  </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Image preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="min-w-full">
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
    </AppLayout>
  );
}
