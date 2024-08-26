import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

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

export default function DashboardPage() {
  return (
    <main>
      {/* Header with Stats*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-b-gray-900/10 border-t-gray-900/10 py-6">
          <div className="mx-auto flex h-10 flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Dashboard
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
            <a
              href="/cashflow/upload"
              className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon aria-hidden="true" className="-ml-1.5 h-5 w-5" />
              Import Statement
            </a>
          </div>
        </header>

        {/* Stats */}
        <div className="border-b border-b-gray-900/10">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={clsx(
                  statIdx % 2 === 1
                    ? 'sm:border-l'
                    : statIdx === 2
                      ? 'lg:border-l'
                      : '',
                  'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8',
                )}
              >
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  {stat.name}
                </dt>
                <dd
                  className={clsx(
                    stat.changeType === 'negative'
                      ? 'text-rose-600'
                      : 'text-gray-700',
                    'text-xs font-medium',
                  )}
                >
                  {stat.change}
                </dd>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Color of stats section */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
        >
          <div
            style={{
              clipPath:
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }}
            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
          />
        </div>
      </div>
      {/** Body */}
      <div className="flex flex-col gap-10 py-10 xl:gap-6">
        <div>Base page</div>
      </div>
    </main>
  );
}
