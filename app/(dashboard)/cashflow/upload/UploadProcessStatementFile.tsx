'use client';

import { addTransactions } from '@/actions/database/transactions';
import { useOrganization } from '@/components/providers/OrganizationProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryType } from '@/lib/types/categories';
import { ClientProviderType } from '@/lib/types/client_providers';
import {
  StatementInformationErrorType,
  StatementInformationType,
  StatementTransactionErrorType,
  StatementTransactionType,
} from '@/lib/types/statements';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import BankTransactionsTable from './BankTransactionsTable';
import InputUploadFile from './InputUploadFile';

interface UploadProcessStatementFileProps {
  categories: CategoryType[];
  clientsProviders: ClientProviderType[];
}

export default function UploadProcessStatementFile({
  categories,
  clientsProviders,
}: UploadProcessStatementFileProps) {
  const { organization } = useOrganization();
  const [information, setInformation] = useState<StatementInformationType>();
  const [bankTransactions, setBankTransactions] =
    useState<StatementTransactionType[]>();
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [currency, setCurrency] = useState('');
  const [informationError, setInformationError] =
    useState<StatementInformationErrorType>();

  const handleClear = () => {
    setInformation(undefined);
    setBankTransactions([]);
  };

  const handleFileProcessed = (result: {
    bankTransactions: StatementTransactionType[];
    information: StatementInformationType;
  }) => {
    console.log(result.bankTransactions);
    setBankTransactions(result.bankTransactions);
    setInformation(result.information);
  };

  const handleTransactionsChange = (
    updatedTransactions: StatementTransactionType[],
  ) => {
    setBankTransactions(updatedTransactions);
  };

  const handleSave = async () => {
    if (bankTransactions) {
      // Check if all required fields are completed
      let anyErrors = false;

      const error: StatementInformationErrorType = {};
      if (!information?.bankAccount && !bankAccount) {
        error.bankAccount = 'Indicate a Bank account';
        anyErrors = true;
      }
      if (!information?.bankName && !bankName) {
        error.bankName = 'Indicate a Bank name';
        anyErrors = true;
      }
      if (!information?.currency && !currency) {
        error.currency = 'Indicate a currency';
        anyErrors = true;
      }
      setInformationError(error);

      const validatedTransactions = bankTransactions.map((transaction) => {
        const error: StatementTransactionErrorType = {};
        let hasError = false;
        if (!transaction.category) {
          error.category = 'Please indicate a category';
          hasError = true;
          anyErrors = true;
        }
        if (!transaction.subcategory) {
          error.subcategory = 'Please indicate a subcategory';
          hasError = true;
          anyErrors = true;
        }
        if (!transaction.clientProvider) {
          error.clientProvider = 'Please indicate a client or provider';
          hasError = true;
          anyErrors = true;
        }

        if (hasError) {
          return {
            ...transaction,
            bankAccount: information?.bankAccount || bankAccount,
            bankName: information?.bankName || bankName,
            currency: information?.currency || currency,
            error,
          };
        }

        return {
          ...transaction,
          bankAccount: information?.bankAccount || bankAccount,
          bankName: information?.bankName || bankName,
          currency: information?.currency || currency,
        };
      });

      setBankTransactions(validatedTransactions);

      if (!anyErrors) {
        try {
          const { transactions, error } = await addTransactions({
            transactions: validatedTransactions,
            organization_id: organization?.id || '',
          });

          console.log({ transactions, error });
          // if (error) throw error;
          // console.log('Data saved successfully', data);
          alert('Transactions saved successfully!');
          handleClear();
        } catch (error) {
          console.error('Error saving data', error);
          alert('Error saving transactions. Please try again.');
        }
      }
    }
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
                    {information?.bankName || (
                      <Input
                        placeholder="Bank name"
                        value={bankName}
                        onChange={(e) => {
                          setBankName(e.target.value);
                          setInformationError(undefined);
                        }}
                      />
                    )}
                    {informationError?.bankName && (
                      <p className="mt-1 text-sm text-red-500">
                        {informationError?.bankName}
                      </p>
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border border-gray-900/5 px-4 py-10 sm:px-6 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Statement account
                  </dt>
                  <dd className="w-full flex-none text-xl font-medium leading-10 tracking-tight text-gray-900">
                    {!information?.bankAccount ||
                    information.bankAccount === 'Unknown' ? (
                      <Input
                        placeholder="Bank account"
                        value={bankAccount}
                        onChange={(e) => {
                          setBankAccount(e.target.value);
                          setInformationError(undefined);
                        }}
                      />
                    ) : (
                      information.bankAccount
                    )}
                    {informationError?.bankAccount && (
                      <p className="mt-1 text-sm text-red-500">
                        {informationError?.bankAccount}
                      </p>
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border border-gray-900/5 px-4 py-10 sm:px-6 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Currency
                  </dt>
                  <dd className="w-full flex-none text-xl font-medium leading-10 tracking-tight text-gray-900">
                    {information?.currency || (
                      <Input
                        placeholder="Currency"
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          setInformationError(undefined);
                        }}
                      />
                    )}
                    {informationError?.currency && (
                      <p className="mt-1 text-sm text-red-500">
                        {informationError?.currency}
                      </p>
                    )}
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
              onTransactionsChange={handleTransactionsChange}
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
