import AuctionPreview from '@/components/auction-preview';
import { t } from '@/i18n';
import { type AuctionItem } from '@/types';
import React from 'react';

interface AuctionGridProps {
  title: React.ReactNode;
  items: AuctionItem[];
  emptyText?: string;
  rightSlot?: React.ReactNode;
}

export default function AuctionGrid({
  title,
  items,
  emptyText,
  rightSlot,
}: AuctionGridProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        {rightSlot}
      </div>

      {items.length === 0 && (
        <div className="rounded border border-dashed p-6 text-center text-sm text-muted-foreground">
          {emptyText ?? t('auction.noAuctionsYet')}
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,320px))] gap-6">
          {items.map((item) => (
            <AuctionPreview key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
