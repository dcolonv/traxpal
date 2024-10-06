import { removeClientProvider } from '@/actions/database/clients_providers';
import RemoveDialog from '@/components/core/RemoveDialog';
import TablePagination from '@/components/core/TablePagination';
import { Button } from '@/components/ui/button';
import { ClientProviderType } from '@/lib/types/client_providers';
import ClientProviderFormDialog from './ClientProviderFormDialog';

interface ClientsProvidersTableProps {
  clientsProviders: ClientProviderType[];
  page: number;
  totalPages: number;
}

export default function ClientsProvidersTable({
  clientsProviders,
  page,
  totalPages,
}: ClientsProvidersTableProps) {
  return (
    <div className="mx-8 mt-8 flow-root">
      <div className="-mx-8 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {clientsProviders.map((clientProvider) => (
                  <tr key={clientProvider.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {clientProvider.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {clientProvider.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                      {clientProvider.type}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <ClientProviderFormDialog
                        key={clientProvider.name}
                        defaultClientProvider={clientProvider}
                      >
                        <Button variant="outline">Edit</Button>
                      </ClientProviderFormDialog>
                      <RemoveDialog
                        id={clientProvider.id}
                        name={clientProvider.name}
                        remove={removeClientProvider}
                      >
                        <Button variant="destructive" className="ml-4">
                          Remove
                        </Button>
                      </RemoveDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TablePagination
        baseHref={`/client-providers`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
