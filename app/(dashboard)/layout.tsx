import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { fetchUser } from '@/actions/database/auth';
import { fetchOrganizations } from '@/actions/database/organizations';
import { NavigationFrame } from '@/components/dashboard/NavigationFrame';
import OrganizationProvider from '@/components/providers/OrganizationProvider';
import { Toaster } from '@/components/ui/toaster';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await fetchUser();

  if (!user) {
    return redirect('/login');
  }

  const organizations = await fetchOrganizations();

  return (
    <OrganizationProvider organizations={organizations}>
      <NavigationFrame />
      <div className="h-full pt-16 lg:pl-64">{children}</div>
      <Toaster />
    </OrganizationProvider>
  );
}
