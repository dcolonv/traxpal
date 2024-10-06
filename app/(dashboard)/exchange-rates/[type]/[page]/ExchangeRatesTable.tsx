import TablePagination from '@/components/core/TablePagination';
import { ExchangeRateType } from '@/lib/types/exchange_rates';
import { formatDateLiteral, getPaginationFactorsArray } from '@/utils/helpers';

interface ExchangeRatesTableProps {
  exchangeRates: ExchangeRateType[];
  type: string;
  page: number;
  totalPages: number;
}

export default function ExchangeRatesTable({
  exchangeRates,
  type,
  page,
  totalPages,
}: ExchangeRatesTableProps) {
  const factorArr = getPaginationFactorsArray(totalPages);

  return (
    <div className="mx-8 mt-8 flow-root">
      <div className="-mx-8 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
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
                {exchangeRates.map((rate) => (
                  <tr key={rate.date} className="divide-x divide-gray-200">
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">
                      {formatDateLiteral(rate.date)}
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
      <TablePagination
        baseHref={`/exchange-rates/${type}`}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
