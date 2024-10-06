import { fetchAllCategories } from '@/actions/database/categories';
import { fetchAllClientsProviders } from '@/actions/database/clients_providers';
import UploadProcessStatementFile from './UploadProcessStatementFile';

type DataType = {
  [key: string]: string;
};

type InformationType = {
  bankAccount: string;
  bankName: string;
  currency: string;
};

export default async function CashflowUploadPage() {
  const { categories } = await fetchAllCategories();
  const { clients_providers } = await fetchAllClientsProviders();

  const information: InformationType = {
    bankName: 'Bac',
    bankAccount: '1000000101',
    currency: 'USD',
  };

  return (
    <main className="bg-white">
      <UploadProcessStatementFile
        categories={categories}
        clientsProviders={clients_providers}
      />
    </main>
  );
}
