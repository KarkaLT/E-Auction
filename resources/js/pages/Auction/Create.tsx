import InputError from '@/components/input-error';
import { buttonVariants } from '@/components/ui/button';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import { localDatetimeInputToUtc } from '@/lib/utils';
import auctionItems from '@/routes/auction-items';
import { Head, Link, useForm } from '@inertiajs/react';
import { UploadIcon, X } from 'lucide-react';
import { useState } from 'react';

export default function CreateAuction() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    photos: [] as File[],
    description: '',
    starting_price: '',
    bid_increment: '',
    end_time: '',
  });

  // Store the local datetime-local value for the input
  const [localEndTime, setLocalEndTime] = useState('');

  const photoError =
    errors.photos ??
    Object.entries(errors).find(([key]) => key.startsWith('photos.'))?.[1];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert local time to UTC before submitting
    const utcEndTime = localDatetimeInputToUtc(localEndTime);
    setData('end_time', utcEndTime);

    post(auctionItems.store().url, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setLocalEndTime('');
      },
    });
  };

  const removeImage = (index: number) => {
    setData(
      'photos',
      data.photos.filter((_, i) => i !== index),
    );
  };

  return (
    <AppLayout>
      <Head title={t('auction.createAuction')} />
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-semibold">
            {t('auction.createAuction')}
          </h1>
        </div>
        <form onSubmit={submit} className="grid w-full gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('auction.title')}</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              required
            />
            {errors.title && <InputError message={errors.title} />}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">{t('auction.images')}</Label>
            <Dropzone
              className="min-h-36"
              accept={{ 'image/*': [] }}
              maxFiles={10}
              onDrop={(files) => setData('photos', [...data.photos, ...files])}
              onError={console.error}
              src={data.photos}
            >
              <DropzoneEmptyState />
              {data.photos.length > 0 ? (
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full gap-4 overflow-x-auto pb-2">
                    {data.photos.map((file, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square h-64 shrink-0"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full rounded-md object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 opacity-0 transition-all group-hover:opacity-100 hover:bg-black/60"
                          aria-label="Remove image"
                        >
                          <X className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <UploadIcon size={16} />
                    </div>
                    <p className="my-2 w-full text-center text-sm font-medium">
                      {t('auction.uploadMoreFiles')}
                    </p>
                    <p className="w-full text-center text-xs text-muted-foreground">
                      {t('auction.dragAndDropOrClick')}
                    </p>
                  </div>
                </div>
              ) : (
                <DropzoneContent />
              )}
            </Dropzone>
            {photoError && <InputError message={photoError} />}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('auction.description')}</Label>
            <textarea
              id="description"
              className="min-h-32 rounded-md border bg-background p-2"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              required
            />
            {errors.description && <InputError message={errors.description} />}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="starting_price">
                {t('auction.startingPrice')}
              </Label>
              <Input
                id="starting_price"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={data.starting_price}
                onChange={(e) => setData('starting_price', e.target.value)}
                required
              />
              <div className="min-h-5">
                {errors.starting_price && (
                  <InputError message={errors.starting_price} />
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bid_increment">{t('auction.bidIncrement')}</Label>
              <Input
                id="bid_increment"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={data.bid_increment}
                onChange={(e) => setData('bid_increment', e.target.value)}
                required
              />
              <div className="min-h-5">
                {errors.bid_increment && (
                  <InputError message={errors.bid_increment} />
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_time">{t('auction.endTime')}</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={localEndTime}
                onChange={(e) => setLocalEndTime(e.target.value)}
                required
              />
              <div className="min-h-5">
                {errors.end_time && <InputError message={errors.end_time} />}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className={buttonVariants({ variant: 'default' })}
            >
              {t('common.create')}
            </button>
            <Link
              href={auctionItems.index().url}
              className={buttonVariants({ variant: 'ghost' })}
            >
              {t('common.cancel')}
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
