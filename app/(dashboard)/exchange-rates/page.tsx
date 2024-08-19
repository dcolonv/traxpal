import { createClient } from '@/utils/supabase/server';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Exchange rate
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A table of historical exchange rate USD - Costarican Colones.
          </p>
        </div>
        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => fetchExchangeRates('16/08/2024', '18/08/2024')}
          >
            Update
          </button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="min-w-sm inline-block py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
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
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
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
    </div>
  );
}
