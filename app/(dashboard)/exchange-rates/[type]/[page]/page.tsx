import { fetchExchangeRates } from '@/actions/database/exchange_rates';
import TableEmptyState from '@/components/core/TableEmptyState';
import ExchangeRatesTable from './ExchangeRatesTable';

export const dynamic = 'force-dynamic';

const secondaryNavigation = [
  { name: 'USD - CRC', href: '/exchange-rates?type=USD-CRC', current: true },
];

interface ExchangeRate {
  id: number;
  type: string;
  date: string;
  buy: number;
  sell: number;
}

export default async function ExchangeRatesPage({
  params,
}: {
  params: { page: string; type: string };
}) {
  const page = parseInt(params.page);
  const type = params.type;
  const itemsPerPage = 15;
  const { exchange_rates, pages } = await fetchExchangeRates(
    type,
    page,
    itemsPerPage,
  );

  return (
    <main>
      {/* Header with Stats*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-b-gray-900/10 border-t-gray-900/10 py-6">
          <div className="mx-auto flex h-10 flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Exchange rates
            </h1>
            <div className="order-none flex w-auto gap-x-8 border-l border-gray-200 pl-6 text-sm font-semibold leading-7">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={item.current ? 'text-indigo-600' : 'text-gray-700'}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </header>
      </div>
      {/** Body */}
      {exchange_rates.length ? (
        <ExchangeRatesTable
          exchangeRates={exchange_rates}
          type={type}
          page={page}
          totalPages={pages}
        />
      ) : (
        <TableEmptyState
          title="No exchange rate yet for this one"
          subtitle="Wait for the automatic rates tool to update, or ask your admin to add it"
        />
      )}
    </main>
  );
}
