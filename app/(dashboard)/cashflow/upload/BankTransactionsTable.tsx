import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryType } from '@/lib/types/categories';
import { ClientProviderType } from '@/lib/types/client_providers';
import { BankTransactionType } from '@/lib/types/statements';

interface BankTransactionsTableProps {
  bankTransactions: BankTransactionType[];
  categories: CategoryType[];
  clientsProviders: ClientProviderType[];
}

export default function BankTransactionsTable({
  bankTransactions,
  categories,
  clientsProviders,
}: BankTransactionsTableProps) {
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
              {bankTransactions.map((bankTransaction) => (
                <tr
                  key={`${bankTransaction.date}-${bankTransaction.reference}`}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {bankTransaction.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.reference}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.debit}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.credit}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.category?.name}
                    <Select value={`${bankTransaction.category?.id || ''}`}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={`${category.id}`}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.subcategory?.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.clientProvider?.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                    {bankTransaction.detail}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {/* <CategorizationRuleFormDialog
                        key={`${categorizationRule.rule}-${categorizationRule.criteria}-${categorizationRule.category_id}-${categorizationRule.subcategory_id}`}
                        defaultCategorizationRule={categorizationRule}
                        categories={categories}
                      >
                        <Button variant="outline">Edit</Button>
                      </CategorizationRuleFormDialog>
                      <RemoveDialog
                        id={categorizationRule.id}
                        name={`Rule ${categorizationRule.rule}: ${categorizationRule.criteria}`}
                        remove={removeCategorizationRule}
                      >
                        <Button variant="destructive" className="ml-4">
                          Remove
                        </Button>
                      </RemoveDialog> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
