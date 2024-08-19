import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { NavigationFrame } from '@/components/dashboard/NavigationFrame';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <>
      <div>
        <NavigationFrame />
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
