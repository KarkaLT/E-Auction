import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { t } from '@/i18n';
import { logout } from '@/routes';
import { update as updateUserRole } from '@/routes/user-role';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Laptop, LogOut, Shield } from 'lucide-react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Switch Profile
      </DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link
          href={updateUserRole().url}
          method="put"
          data={{ role: 'seller' }}
          preserveScroll
          as="button"
          className="flex w-full cursor-pointer items-center text-left"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>Seller</span>
          {user.role === 'seller' && <span className="ml-auto text-xs">✓</span>}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link
          href={updateUserRole().url}
          method="put"
          data={{ role: 'buyer' }}
          preserveScroll
          as="button"
          className="flex w-full cursor-pointer items-center text-left"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>Buyer</span>
          {user.role === 'buyer' && <span className="ml-auto text-xs">✓</span>}
        </Link>
      </DropdownMenuItem>
      {user.is_admin && (
        <DropdownMenuItem asChild>
          <Link
            href={updateUserRole().url}
            method="put"
            data={{ role: 'admin' }}
            preserveScroll
            as="button"
            className="flex w-full cursor-pointer items-center text-left"
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin</span>
            {user.role === 'admin' && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          className="block w-full"
          href={logout()}
          as="button"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          {t('common.logout')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
