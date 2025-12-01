import AppLogoIcon from '@/components/app-logo-icon';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { t } from '@/i18n';
import { login, register } from '@/routes';
import auctionItems from '@/routes/auction-items';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  Gavel,
  Home,
  LayoutDashboard,
  LogIn,
  PlusSquare,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';

export function AppSidebar() {
  const { auth } = usePage<SharedData>().props;
  const user = auth?.user;
  const currentPath = window.location.pathname;

  // Save sidebar state to backend
  const saveSidebarState = async (isOpen: boolean) => {
    if (!user) return;

    // Send plain AJAX request to avoid Inertia header requirement.
    // This backend route returns JSON and should not be treated as an Inertia response.
    try {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

      await fetch('/settings/sidebar-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': token ?? '',
          'X-Inertia': 'false',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ sidebar_open: isOpen }),
      });
    } catch (error) {
      // Swallow errors so toggling the sidebar doesn't break UX; optionally log for dev.
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save sidebar state', error);
      }
    }
  };

  // Listen for sidebar state changes
  useEffect(() => {
    // Listen for custom events
    const onSidebarStateChange = (e: CustomEvent) => {
      saveSidebarState(e.detail.open);
    };

    window.addEventListener(
      'sidebar-state-changed',
      onSidebarStateChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        'sidebar-state-changed',
        onSidebarStateChange as EventListener,
      );
    };
  }, []);

  const menuItems = [
    {
      title: t('common.home'),
      url: '/',
      icon: Home,
      visible: true,
    },
    {
      title: t('common.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
      visible: user?.role === 'seller',
    },
    {
      title: t('common.auctions'),
      url: '/auction-items',
      icon: Gavel,
      visible: true,
    },
    {
      title: t('auction.createAuction'),
      url: auctionItems.create().url,
      icon: PlusSquare,
      visible: user?.role === 'seller',
    },
    {
      title: t('common.settings'),
      url: '/settings',
      icon: Settings,
      visible: !!user,
    },
    {
      title: t('admin.users'),
      url: '/admin/users',
      icon: Users,
      visible: user?.role === 'admin',
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <AppLogoIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">E-Auction</span>
                  <span className="truncate text-xs">
                    {user?.role === 'admin'
                      ? t('common.admin')
                      : user?.role === 'seller'
                        ? t('common.seller')
                        : user?.role === 'buyer'
                          ? t('common.buyer')
                          : t('common.guest')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => {
                const isActive =
                  currentPath === item.url ||
                  (item.url !== '/' && currentPath.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url} preserveState preserveScroll>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={login().url} preserveState preserveScroll>
                  <LogIn />
                  <span>{t('common.login')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={register().url} preserveState preserveScroll>
                  <UserPlus />
                  <span>{t('common.register')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
