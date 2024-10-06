import { removeCategory } from '@/actions/database/categories';
import RemoveDialog from '@/components/core/RemoveDialog';
import TablePagination from '@/components/core/TablePagination';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types/categories';
import CategoryFormDialog from './CategoryFormDialog';
import SubcategoriesDrawer from './SubcategoriesDrawer';

interface CategoriesTableProps {
  categories: CategoryType[];
  page: number;
  totalPages: number;
}

export default function CategoriesTable({
  categories,
  page,
  totalPages,
}: CategoriesTableProps) {
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
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {category.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {category.name}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <CategoryFormDialog
                        key={category.name}
                        defaultCategory={category}
                      >
                        <Button variant="outline" className="mr-4">
                          Edit
                        </Button>
                      </CategoryFormDialog>
                      <RemoveDialog
                        id={category.id}
                        name={category.name}
                        remove={removeCategory}
                      >
                        <Button variant="destructive" className="mr-4">
                          Remove
                        </Button>
                      </RemoveDialog>
                      <SubcategoriesDrawer category={category} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TablePagination
        baseHref={`/categories`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
