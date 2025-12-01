import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default ({ children }: AppLayoutProps) => (
  <AppSidebarLayout>{children}</AppSidebarLayout>
);
