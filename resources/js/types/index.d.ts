import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  auctions?: AuctionItem[];
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  is_admin?: boolean;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface AuctionItem {
  id: number;
  title: string;
  description?: string;
  starting_price: string;
  current_price?: string | null;
  bid_increment?: string;
  end_time: string;
  status: 'active' | 'finished' | 'sold' | 'canceled' | string;
  // Appended attributes from the backend model
  first_photo?: string | null;
  current_bid?: string;
  winner?: User | null;
  [key: string]: unknown;
}
