import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSameUrl(
  url1: NonNullable<InertiaLinkProps['href']>,
  url2: NonNullable<InertiaLinkProps['href']>,
) {
  return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
  return typeof url === 'string' ? url : url.url;
}

/**
 * Format an auction end time according to rules:
 * - If ending in <= 24 hours: show hours remaining (e.g. "5 hours left")
 * - If ending in < 7 days: show days remaining (e.g. "3 days left")
 * - Otherwise: show the localized date string
 */
export function formatEndTime(endTime: string | Date): string {
  const end = endTime instanceof Date ? endTime : new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (Number.isNaN(end.getTime())) {
    return '';
  }

  if (diff <= 0) {
    return 'Ended';
  }

  const oneHour = 1000 * 60 * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;

  if (diff <= oneDay) {
    const hours = Math.ceil(diff / oneHour);
    return hours === 1 ? '1 hour left' : `${hours} hours left`;
  }

  if (diff < oneWeek) {
    const days = Math.ceil(diff / oneDay);
    return days === 1 ? '1 day left' : `${days} days left`;
  }

  // Otherwise show a concise date (e.g. "Nov 25, 2025")
  return end.toLocaleDateString();
}
