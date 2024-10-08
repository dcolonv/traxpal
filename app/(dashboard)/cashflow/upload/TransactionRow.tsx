import { StatementTransactionType } from '@/lib/types/statements';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryType } from '@/lib/types/categories';
import { ClientProviderType } from '@/lib/types/client_providers';

interface TransactionRowProps {
  index: number;
  transaction: StatementTransactionType;
  categories: CategoryType[];
  clientsProviders: ClientProviderType[];
  handleChange: (index: number, field: string, value: string) => void;
}

export default function TransactionRow({
  index,
  transaction,
  categories,
  clientsProviders,
  handleChange,
}: TransactionRowProps) {
  const subcategories = categories.find(
    (cat) => cat.id === transaction.category?.id,
  )?.subcategories;

  return (
    <tr key={index}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
        {format(transaction.date, 'dd/MMM/yyy')}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm capitalize">
        {transaction.reference}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm capitalize">
        {transaction.description}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm capitalize">
        {transaction.debit}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm capitalize">
        {transaction.credit}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Select
          value={`${transaction.category?.id || ''}`}
          onValueChange={(value) => {
            handleChange(index, 'category', value);
          }}
        >
          <SelectTrigger className="red-900 w-[250px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={`${category.id}`}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {transaction.error?.category && (
          <p className="mt-1 text-red-500">{transaction.error?.category}</p>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Select
          disabled={!transaction.category}
          value={`${transaction.subcategory?.id || ''}`}
          onValueChange={(value) => handleChange(index, 'subcategory', value)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue
              placeholder="Select a subcategory"
              className="text-gray-500"
            />
          </SelectTrigger>
          <SelectContent>
            {subcategories?.map((subcategory) => (
              <SelectItem key={subcategory.id} value={`${subcategory.id}`}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {transaction.error?.subcategory && (
          <p className="mt-1 text-red-500">{transaction.error?.subcategory}</p>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Select
          value={`${transaction.clientProvider?.id || ''}`}
          onValueChange={(value) =>
            handleChange(index, 'clientProvider', value)
          }
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a client or provider" />
          </SelectTrigger>
          <SelectContent>
            {clientsProviders?.map((clientProvider) => (
              <SelectItem
                key={clientProvider.id}
                value={`${clientProvider.id}`}
              >
                {clientProvider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {transaction.error?.clientProvider && (
          <p className="mt-1 text-red-500">
            {transaction.error?.clientProvider}
          </p>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <Input
          className="w-[280px]"
          value={transaction.detail || ''}
          onChange={(e) => handleChange(index, 'detail', e.target.value)}
        />
      </td>
    </tr>
  );
}
