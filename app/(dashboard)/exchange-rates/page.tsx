import { createClient } from '@/utils/supabase/server';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

const secondaryNavigation = [
  { name: 'USD - CRC', href: '/exchange-rates?type=USD-CRC', current: true },
];

const stats = [
  {
    name: 'Revenue',
    value: '$405,091.00',
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Overdue invoices',
    value: '$12,787.00',
    change: '+54.02%',
    changeType: 'negative',
  },
  {
    name: 'Outstanding invoices',
    value: '$245,988.00',
    change: '-1.39%',
    changeType: 'positive',
  },
  {
    name: 'Expenses',
    value: '$30,156.00',
    change: '+10.18%',
    changeType: 'negative',
  },
];

interface ExchangeRate {
  id: number;
  type: string;
  date: string;
  buy: number;
  sell: number;
}

async function getExchangeRates(page: number = 1) {
  const supabase = createClient();
  const itemsPerPage = 25;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from('exchange_rates')
    .select('*', { count: 'exact' })
    .range(start, end)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }

  return {
    rates: data as ExchangeRate[],
    totalPages: Math.ceil((count || 0) / itemsPerPage),
  };
}

export default async function ExchangeRatesPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { rates, totalPages } = await getExchangeRates(page);

  function formatDate(dateString: string) {
    const date = parseISO(dateString);
    return format(date, 'PPP');
  }

  return (
    <main>
      {/* Header with Stats*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-b-gray-900/10 border-t-gray-900/10 py-6">
          <div className="mx-auto flex h-10 flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Exchange rates
            </h1>
            <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
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
      <div className="flex flex-col gap-10 py-10 xl:gap-6">
        <div className="inline-block min-w-full px-6 align-middle lg:px-10">
          <div className="overflow-hidden sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Buy
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Sell
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rates.map((rate) => (
                  <tr key={rate.date} className="divide-x divide-gray-200">
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">
                      {formatDate(rate.date)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {rate.buy}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {rate.sell}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
