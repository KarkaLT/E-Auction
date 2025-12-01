import { AppFooter } from '@/components/app-footer';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import type { PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="text-lg font-semibold">E-Auction</div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        <AppFooter />
      </SidebarInset>
    </AppShell>
  );
}
