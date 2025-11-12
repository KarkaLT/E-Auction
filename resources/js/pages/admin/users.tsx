import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatLocalDateTime } from '@/lib/utils';

import AppLayout from '@/layouts/app-layout';
import { users } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: users().url,
  },
  {
    title: 'Users',
    href: users().url,
  },
];

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
  ip_address: string | null;
  auctions_created: number;
  items_bought: number;
  created_at: string;
}

interface AdminUsersPageProps {
  users: AdminUser[];
  [key: string]: unknown;
}

export default function AdminUsers() {
  const { props } = usePage<AdminUsersPageProps>();
  const usersList = props.users ?? [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users Management" />
      <div className="mt-6 flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Users Management</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">
                      Auctions Created
                    </TableHead>
                    <TableHead className="text-right">Items Bought</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    usersList.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.ip_address || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {user.blocked ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                              Active
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.auctions_created}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.items_bought}
                        </TableCell>
                        <TableCell>
                          {formatLocalDateTime(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.blocked ? (
                            <button
                              className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                              onClick={() =>
                                router.post(`/admin/users/${user.id}/unblock`)
                              }
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                              onClick={() =>
                                router.post(`/admin/users/${user.id}/block`)
                              }
                            >
                              Block
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
