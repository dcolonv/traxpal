'use client';

import { CategoryType } from '@/lib/types/categories';
import { ClientProviderType } from '@/lib/types/client_providers';
import { StatementTransactionType } from '@/lib/types/statements';
import TransactionRow from './TransactionRow';

interface BankTransactionsTableProps {
  bankTransactions: StatementTransactionType[];
  categories: CategoryType[];
  clientsProviders: ClientProviderType[];
  onTransactionsChange: (transactions: StatementTransactionType[]) => void;
}

export default function BankTransactionsTable({
  bankTransactions,
  categories,
  clientsProviders,
  onTransactionsChange,
}: BankTransactionsTableProps) {
  const handleChange = (index: number, field: string, value: string) => {
    const updatedTransactions = [...bankTransactions];

    if (field === 'category') {
      // find category by id
      const categoryId = parseInt(value);
      const category = categories.find((cat) => cat.id === categoryId);
      // Reset subcategory when category changes
      updatedTransactions[index] = {
        ...updatedTransactions[index],
        category,
        subcategory: undefined,
        error: undefined,
      };
    } else if (field === 'subcategory') {
      // find subcategory by id
      const subcategoryId = parseInt(value);
      const subcategory = updatedTransactions[
        index
      ]?.category?.subcategories?.find((scat) => scat.id === subcategoryId);
      // Reset subcategory when category changes
      updatedTransactions[index] = {
        ...updatedTransactions[index],
        subcategory,
        error: undefined,
      };
    } else if (field === 'clientProvider') {
      // find clientProvider by id
      const clientProviderId = parseInt(value);
      const clientProvider = clientsProviders.find(
        (cp) => cp.id === clientProviderId,
      );
      // Reset subcategory when category changes
      updatedTransactions[index] = {
        ...updatedTransactions[index],
        clientProvider,
        error: undefined,
      };
    } else {
      updatedTransactions[index] = {
        ...updatedTransactions[index],
        [field]: value,
      };
    }

    onTransactionsChange(updatedTransactions);
  };

  return (
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
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Debit
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Credit
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Subcategory
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Client/Provider
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Detail
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bankTransactions.map((transaction, index) => (
                <TransactionRow
                  key={index}
                  index={index}
                  transaction={transaction}
                  categories={categories}
                  clientsProviders={clientsProviders}
                  handleChange={handleChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
