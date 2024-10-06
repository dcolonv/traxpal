import { removeCategorizationRule } from '@/actions/database/categorization_rules';
import RemoveDialog from '@/components/core/RemoveDialog';
import TablePagination from '@/components/core/TablePagination';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types/categories';
import { CategorizationRuleType } from '@/lib/types/categorization_rules';
import CategorizationRuleFormDialog from './CategorizationRuleFormDialog';

interface CategorizationRulesTableProps {
  categorizationRules: CategorizationRuleType[];
  page: number;
  totalPages: number;
  categories: CategoryType[];
}

export default function CategorizationRulesTable({
  categorizationRules,
  page,
  totalPages,
  categories,
}: CategorizationRulesTableProps) {
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
                    Rule
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Categorization
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categorizationRules.map((categorizationRule) => (
                  <tr key={categorizationRule.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {categorizationRule.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                      {categorizationRule.rule}: {categorizationRule.criteria}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm capitalize text-gray-500">
                      {categorizationRule.category?.name} &rarr;{' '}
                      {categorizationRule.subcategory?.name}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <CategorizationRuleFormDialog
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
