'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryType } from '@/lib/types/categories';
import { ClientProviderType } from '@/lib/types/client_providers';
import {
  BankTransactionType,
  StatementInformationType,
} from '@/lib/types/statements';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import BankTransactionsTable from './BankTransactionsTable';
import InputUploadFile from './InputUploadFile';

type InformationType = {
  bankAccount: string;
  bankName: string;
  currency: string;
};

interface UploadProcessStatementFileProps {
  categories: CategoryType[];
  clientsProviders: ClientProviderType[];
}

export default function UploadProcessStatementFile({
  categories,
  clientsProviders,
}: UploadProcessStatementFileProps) {
  const [information, setInformation] = useState<InformationType>();
  const [bankTransactions, setBankTransactions] = useState<
    BankTransactionType[]
  >([]);

  const handleClear = () => {
    setBankTransactions([]);
  };

  const handleCellChange = (
    rowIndex: number,
    header: string,
    value: string,
  ) => {
    console.log('here', { rowIndex, header, value });
    const newData = [...bankTransactions];
    console.log(newData);
    // newData[rowIndex][header.toLowerCase()] = value;
    setBankTransactions(newData);
  };

  const handleSave = async () => {
    // try {
    //   const { data, error } = await supabase.from('csv_data').insert(data);
    //   if (error) throw error;
    //   console.log('Data saved successfully', data);
    //   router.push('/success');
    // } catch (error) {
    //   console.error('Error saving data', error);
    // }
  };

  const handleFileProcessed = (result: {
    bankTransactions: BankTransactionType[];
    information: StatementInformationType;
  }) => {
    setBankTransactions(result.bankTransactions);
    setInformation(result.information);
  };

  return (
    <>
      {/* Header*/}
      <div className="relative isolate overflow-hidden">
        <header className="border-b border-gray-200 py-6">
          <div className="flex h-10 flex-wrap items-center justify-between gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Import bank statement
            </h1>
          </div>
        </header>
        {information && (
          <>
            {/* Stats */}
            <div className="border-b border-b-gray-900/10">
              <dl className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border border-gray-900/5 px-4 py-10 sm:px-6 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Bank name
                  </dt>
                  <dd className="w-full flex-none text-xl font-medium leading-10 tracking-tight text-gray-900">
                    {information?.bankName || <Input placeholder="Bank name" />}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border border-gray-900/5 px-4 py-10 sm:px-6 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Statement account
                  </dt>
                  <dd className="w-full flex-none truncate text-xl font-medium leading-10 tracking-tight text-gray-900">
                    {information?.bankAccount || (
                      <Input placeholder="Bank account" />
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border border-gray-900/5 px-4 py-10 sm:px-6 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Currency
                  </dt>
                  <dd className="w-full flex-none text-xl font-medium leading-10 tracking-tight text-gray-900">
                    {information?.currency || <Input placeholder="Currency" />}
                  </dd>
                </div>
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
          </>
        )}
      </div>
      <div className="mx-8 mt-8 flow-root">
        {bankTransactions?.length ? (
          <>
            <BankTransactionsTable
              bankTransactions={bankTransactions}
              categories={categories}
              clientsProviders={clientsProviders}
            />
            <div className="my-6 flex flex-row items-center justify-between gap-6">
              <Button onClick={handleClear} variant="ghost">
                <ArrowPathIcon
                  aria-hidden="true"
                  className="-ml-1.5 mr-1 h-5 w-5"
                />
                Load another file
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </>
        ) : (
          <InputUploadFile onProcessFile={handleFileProcessed} />
        )}
      </div>
    </>
  );
}
