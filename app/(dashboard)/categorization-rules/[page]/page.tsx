import { fetchAllCategories } from '@/actions/database/categories';
import { fetchCategorizationRules } from '@/actions/database/categorization_rules';
import TableEmptyState from '@/components/core/TableEmptyState';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import CategorizationRuleFormDialog from './CategorizationRuleFormDialog';
import CategorizationRulesTable from './CategorizationRulesTable';

export default async function ClientsProvidersPage({
  params,
}: {
  params: { page: string };
}) {
  const page = parseInt(params.page);
  if (isNaN(page)) {
    return redirect('/categorization-rules/1');
  }

  const { categories } = await fetchAllCategories();

  const itemsPerPage = 15;
  const { categorization_rules, pages, error } = await fetchCategorizationRules(
    page,
    itemsPerPage,
  );

  if (error) {
    return redirect('/categorization-rules/1');
  }

  return (
    <main className="bg-white">
      {/* Header*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-gray-200 py-6">
          <div className="flex h-10 flex-wrap items-center justify-between gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Categorization Rules
            </h1>
            <CategorizationRuleFormDialog categories={categories}>
              <Button>
                <PlusIcon aria-hidden="true" className="-ml-1.5 h-5 w-5" />
                New Categorization Rule
              </Button>
            </CategorizationRuleFormDialog>
          </div>
        </header>
      </div>

      {/** Body */}
      {categorization_rules.length ? (
        <CategorizationRulesTable
          categorizationRules={categorization_rules}
          page={page}
          totalPages={pages}
          categories={categories}
        />
      ) : (
        <TableEmptyState
          title="No categorization rules yet"
          subtitle="Get started by creating a new one."
        />
      )}
    </main>
  );
}
