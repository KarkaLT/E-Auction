import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
  const serverSidebarOpen = usePage<SharedData>().props.sidebarOpen;
  const [clientSidebarOpen, setClientSidebarOpen] = useState(serverSidebarOpen);

  if (variant === 'header') {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }

  return (
    <SidebarProvider
      open={clientSidebarOpen}
      onOpenChange={setClientSidebarOpen}
    >
      {children}
    </SidebarProvider>
  );
}
