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
    return 'Pasibaigė';
  }

  const oneMinute = 1000 * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;
  if (diff <= oneHour) {
    const minutes = Math.ceil(diff / oneMinute);
    return minutes === 1 ? 'Liko 1 minutė' : `Liko ${minutes} min.`;
  }

  if (diff <= oneDay) {
    const hours = Math.ceil(diff / oneHour);
    return hours === 1 ? 'Liko 1 valanda' : `Liko ${hours} val.`;
  }

  if (diff < oneWeek) {
    const days = Math.ceil(diff / oneDay);
    return days === 1 ? 'Liko 1 diena' : `Liko ${days} d.`;
  }

  // Otherwise show a concise date (e.g. "Nov 25, 2025")
  return end.toLocaleDateString('lt-LT');
}

/**
 * Convert a UTC ISO string from the backend to a local datetime string
 * suitable for datetime-local inputs (YYYY-MM-DDTHH:mm format)
 */
export function utcToLocalDatetimeInput(utcString: string): string {
  const date = new Date(utcString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  // Format as YYYY-MM-DDTHH:mm in local timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert a local datetime string from datetime-local input to UTC ISO string
 * for sending to the backend
 */
export function localDatetimeInputToUtc(localString: string): string {
  if (!localString) return '';

  // datetime-local gives us a string like "2025-11-15T14:30"
  // which JavaScript interprets as local time
  const date = new Date(localString);
  if (Number.isNaN(date.getTime())) {
    return localString; // fallback to original if invalid
  }

  return date.toISOString();
}

/**
 * Format a UTC date string to a readable local date and time
 */
export function formatLocalDateTime(utcString: string | Date): string {
  const date = utcString instanceof Date ? utcString : new Date(utcString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
