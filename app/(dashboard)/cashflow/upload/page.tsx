import { fetchAllCategories } from '@/actions/database/categories';
import { fetchAllClientsProviders } from '@/actions/database/clients_providers';
import UploadProcessStatementFile from './UploadProcessStatementFile';

export default async function CashflowUploadPage() {
  const { categories } = await fetchAllCategories();
  const { clients_providers } = await fetchAllClientsProviders();

  return (
    <main className="bg-white">
      <UploadProcessStatementFile
        categories={categories}
        clientsProviders={clients_providers}
      />
    </main>
  );
}
