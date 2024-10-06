import { fetchClientsProviders } from '@/actions/database/clients_providers';
import TableEmptyState from '@/components/core/TableEmptyState';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import ClientProviderFormDialog from './ClientProviderFormDialog';
import ClientsProvidersTable from './ClientsProvidersTable';

export default async function ClientsProvidersPage({
  params,
}: {
  params: { page: string };
}) {
  const page = parseInt(params.page);
  if (isNaN(page)) {
    return redirect('/client-providers/1');
  }

  const itemsPerPage = 15;
  const { clients_providers, pages, error } = await fetchClientsProviders(
    page,
    itemsPerPage,
  );

  if (error) {
    return redirect('/client-providers/1');
  }

  return (
    <main className="bg-white">
      {/* Header*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-gray-200 py-6">
          <div className="flex h-10 flex-wrap items-center justify-between gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Clients and Providers
            </h1>
            <ClientProviderFormDialog>
              <Button>
                <PlusIcon aria-hidden="true" className="-ml-1.5 h-5 w-5" />
                New Client/Provider
              </Button>
            </ClientProviderFormDialog>
          </div>
        </header>
      </div>

      {/** Body */}
      {clients_providers.length ? (
        <ClientsProvidersTable
          clientsProviders={clients_providers}
          page={page}
          totalPages={pages}
        />
      ) : (
        <TableEmptyState
          title="No clients or providers yet"
          subtitle="Get started by creating a new one."
        />
      )}
    </main>
  );
}
