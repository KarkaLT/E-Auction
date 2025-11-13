import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { t } from '@/i18n';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard, home, login } from '@/routes';
import { users } from '@/routes/admin';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Menu, Users } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
  {
    title: t('common.dashboard'),
    href: dashboard(),
    icon: LayoutGrid,
  },
];

const activeItemStyles =
  'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const user = auth?.user;

  // Build nav items based on user role
  let navItems = mainNavItems;

  if (!user) {
    // Hide auth-required items when not logged in
    navItems = [];
  } else if (user.role === 'admin') {
    // Add admin items for admin users
    navItems = [
      ...mainNavItems,
      {
        title: t('admin.users'),
        href: users(),
        icon: Users,
      },
    ];
  }
  const getInitials = useInitials();
  return (
    <>
      <div className="border-b border-sidebar-border/80">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 h-[34px] w-[34px]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
              >
                <SheetTitle className="sr-only">
                  {t('common.settings')}
                </SheetTitle>
                <SheetHeader className="flex justify-start text-left">
                  <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                  <div className="flex h-full flex-col justify-between text-sm">
                    <div className="flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center space-x-2 font-medium"
                        >
                          {item.icon && (
                            <Icon iconNode={item.icon} className="h-5 w-5" />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href={home()} prefetch className="flex items-center space-x-2">
            <AppLogo />
          </Link>

          <div className="flex-1"></div>

          <div className="ml-auto flex items-center space-x-2 lg:ml-6">
            {user ? (
              <>
                {/* Desktop Navigation */}
                <div className="hidden h-full items-center space-x-6 lg:flex">
                  <NavigationMenu className="flex h-full items-stretch">
                    <NavigationMenuList className="flex h-full items-stretch space-x-2">
                      {navItems.map((item, index) => (
                        <NavigationMenuItem
                          key={index}
                          className="relative flex h-full items-center"
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              isSameUrl(page.url, item.href) &&
                                activeItemStyles,
                              'h-9 cursor-pointer px-3',
                            )}
                          >
                            {item.icon && (
                              <Icon
                                iconNode={item.icon}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            {item.title}
                          </Link>
                          {isSameUrl(page.url, item.href) && (
                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                          )}
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="size-10 rounded-full p-1"
                    >
                      <Avatar className="size-8 overflow-hidden rounded-full">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name ?? 'User'}`}
                          alt={user.name}
                        />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <UserMenuContent user={user} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href={login()} className="ml-2">
                <Button variant="ghost" size="sm">
                  {t('common.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {breadcrumbs.length > 1 && (
        <div className="flex w-full border-b border-sidebar-border/70">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  );
}
