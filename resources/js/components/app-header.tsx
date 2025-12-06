import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

export function AppHeader() {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const user = auth?.user;

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
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center space-x-2">
            <AppLogo />
          </div>

          <div className="flex-1"></div>

          <div className="ml-auto flex items-center space-x-2 lg:ml-6">
            {user ? (
              <>
                {/* Desktop Navigation */}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('login');
                  }}
                >
                  {t('common.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
