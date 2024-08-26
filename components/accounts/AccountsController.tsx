'use client';

import {
  addAccount,
  removeAccount,
  updateAccount,
} from '@/actions/database/accounts';
import {
  addSubaccount,
  removeSubaccount,
  updateSubaccount,
} from '@/actions/database/subaccounts';
import { AccountType, SubaccountType } from '@/lib/types/accounts';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import EmptyState from './EmptyState';

export default function AccountsController({
  accounts,
}: {
  accounts: AccountType[];
}) {
  const [displayedAccounts, setDisplayedAccounts] = useState<AccountType[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountType>();

  const [addingNewAccount, setAddingNewAccount] = useState(false);
  const [addingNewSubaccount, setAddingNewSubaccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountType>();
  const [editingSubaccount, setEditingSubaccount] = useState<SubaccountType>();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisplayedAccounts(accounts);
  }, [accounts]);

  const handleSaveNewAccount = async (formData: FormData) => {
    const name = (formData.get('account') as string).trim();
    if (name) {
      setIsSaving(true);
      const { account } = await addAccount({ name });
      if (account) {
        setDisplayedAccounts([account, ...displayedAccounts]);
      }
      setAddingNewAccount(false);
      setIsSaving(false);
    }
  };

  const handleSaveEditAccount = async (formData: FormData) => {
    const name = (formData.get('account') as string).trim();
    if (name && editingAccount) {
      setIsSaving(true);
      const { account } = await updateAccount({ id: editingAccount.id, name });
      if (account) {
        const acctIdx = displayedAccounts.findIndex(
          (acct) => acct.id === account.id,
        );
        const oldAccount = displayedAccounts[acctIdx];
        setDisplayedAccounts([
          ...displayedAccounts.slice(0, acctIdx),
          { ...oldAccount, ...account },
          ...displayedAccounts.slice(acctIdx + 1),
        ]);
        if (selectedAccount?.id === account.id) {
          setSelectedAccount({ ...oldAccount, ...account });
        }
      }
      setEditingAccount(undefined);
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (id) {
      setIsSaving(true);
      const { success } = await removeAccount({ id });
      if (success) {
        const acctIdx = displayedAccounts.findIndex((acct) => acct.id === id);
        setDisplayedAccounts([
          ...displayedAccounts.slice(0, acctIdx),
          ...displayedAccounts.slice(acctIdx + 1),
        ]);
        if (selectedAccount?.id === id) {
          setSelectedAccount(undefined);
        }
      }
      setEditingAccount(undefined);
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setSelectedAccount(undefined);
    setAddingNewSubaccount(false);
  };

  const handleSaveNewSubaccount = async (formData: FormData) => {
    const name = (formData.get('subaccount') as string).trim();
    if (name) {
      setIsSaving(true);
      const { subaccount } = await addSubaccount({
        account_id: selectedAccount?.id as string,
        name,
      });

      if (subaccount) {
        const acctIdx = displayedAccounts.findIndex(
          (acct) => acct.id === selectedAccount?.id,
        );
        const account = displayedAccounts[acctIdx];
        account.subaccounts = [subaccount, ...(account.subaccounts || [])];
        setDisplayedAccounts([
          ...displayedAccounts.slice(0, acctIdx),
          account,
          ...displayedAccounts.slice(acctIdx + 1),
        ]);
      }

      setAddingNewSubaccount(false);
      setIsSaving(false);
    }
  };

  const handleSaveEditSubaccount = async (formData: FormData) => {
    const name = (formData.get('subaccount') as string).trim();
    if (name && editingSubaccount) {
      setIsSaving(true);
      const { subaccount } = await updateSubaccount({
        id: editingSubaccount.id,
        name,
      });
      if (subaccount) {
        const acctIdx = displayedAccounts.findIndex(
          (acct) => acct.id === subaccount.account_id,
        );
        const account = displayedAccounts[acctIdx];
        if (account.subaccounts) {
          const subacctIdx = account.subaccounts.findIndex(
            (subacct) => subacct.id === subaccount.id,
          );
          const editedAccount = {
            ...account,
            subaccounts: [
              ...account.subaccounts.slice(0, subacctIdx),
              subaccount,
              ...account.subaccounts.slice(subacctIdx + 1),
            ],
          };
          setDisplayedAccounts([
            ...displayedAccounts.slice(0, acctIdx),
            editedAccount,
            ...displayedAccounts.slice(acctIdx + 1),
          ]);
          if (selectedAccount?.id === editedAccount.id) {
            setSelectedAccount(editedAccount);
          }
        }
      }
      setEditingSubaccount(undefined);
      setIsSaving(false);
    }
  };

  const handleDeleteSubaccount = async (id: string) => {
    if (id) {
      setIsSaving(true);
      const { success } = await removeSubaccount({ id });
      if (success) {
        const acctIdx = displayedAccounts.findIndex(
          (acct) => acct.id === selectedAccount?.id,
        );
        const account = displayedAccounts[acctIdx];
        const editedAccount = {
          ...account,
          subaccounts: (account.subaccounts || []).filter(
            (subacct) => subacct.id !== id,
          ),
        };
        setDisplayedAccounts([
          ...displayedAccounts.slice(0, acctIdx),
          editedAccount,
          ...displayedAccounts.slice(acctIdx + 1),
        ]);
        if (selectedAccount?.id === editedAccount.id) {
          setSelectedAccount(editedAccount);
        }
      }
      setEditingSubaccount(undefined);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={`relative overflow-y-auto pb-10 transition-all duration-300 ease-in-out ${
          selectedAccount
            ? 'w-[0%] border-r border-black/5 lg:w-[50%]'
            : 'w-full'
        }`}
      >
        <main>
          <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-black">
              Accounts
            </h1>

            <Button onClick={() => setAddingNewAccount(true)}>
              <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
              New <span className="hidden md:block">&nbsp;Account</span>
            </Button>
          </header>

          {/* Accounts list */}
          <ul role="list" className="divide-y divide-black/5">
            {addingNewAccount && (
              <form action={handleSaveNewAccount}>
                <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                      <Input
                        id="account"
                        name="account"
                        placeholder="New account"
                        disabled={isSaving}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      type="submit"
                      disabled={isSaving}
                    >
                      <CheckIcon aria-hidden="true" className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={isSaving}
                      onClick={() => setAddingNewAccount(false)}
                    >
                      <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              </form>
            )}
            {!displayedAccounts?.length && !addingNewAccount ? (
              <EmptyState
                title="No accounts yet"
                subtitle="Get started by creating a new one."
                action="New Account"
                onClick={() => setAddingNewAccount(true)}
              />
            ) : (
              displayedAccounts.map((account) => {
                if (account.id === editingAccount?.id) {
                  return (
                    <form key={account.id} action={handleSaveEditAccount}>
                      <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            <Input
                              id="account"
                              name="account"
                              placeholder="Edit account"
                              defaultValue={account.name}
                              disabled={isSaving}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            type="submit"
                            disabled={isSaving}
                          >
                            <CheckIcon aria-hidden="true" className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isSaving}
                            onClick={() => setEditingAccount(undefined)}
                          >
                            <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                disabled={isSaving}
                              >
                                <TrashIcon
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove all
                                  subaccounts.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteAccount(account.id)
                                  }
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    </form>
                  );
                }
                return (
                  <li
                    key={account.id}
                    className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
                  >
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <h2 className="min-w-0 text-sm leading-6 text-gray-600">
                          <span className="truncate">{account.name}</span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditingAccount(account)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedAccount(account)}
                      >
                        <span className="mr-2 hidden md:block">
                          {account.subaccounts?.length || 0} Subaccounts
                        </span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </main>
      </div>

      <div
        className={`relative overflow-y-auto bg-white transition-all duration-300 ease-in-out ${
          selectedAccount ? 'w-[100%] opacity-100 lg:w-[50%]' : 'w-0 opacity-0'
        }`}
      >
        {selectedAccount && (
          <aside>
            <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeftIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex flex-col items-center">
                <h2 className="text-base font-semibold leading-7 text-black">
                  {selectedAccount.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">Subaccounts</p>
              </div>
              <Button onClick={() => setAddingNewSubaccount(true)}>
                <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                New
              </Button>
            </header>
            <ul role="list" className="divide-y divide-black/5">
              {addingNewSubaccount && (
                <form action={handleSaveNewSubaccount}>
                  <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <Input
                          id="subaccount"
                          name="subaccount"
                          placeholder="New subaccount"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        type="submit"
                        disabled={isSaving}
                      >
                        <CheckIcon aria-hidden="true" className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isSaving}
                        onClick={() => setAddingNewSubaccount(false)}
                      >
                        <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                </form>
              )}
              {!selectedAccount.subaccounts?.length ? (
                <EmptyState
                  title={`No subaccounts yet`}
                  subtitle="Create a new subaccount."
                  action="New subaccount"
                  onClick={() => setAddingNewSubaccount(true)}
                />
              ) : (
                selectedAccount.subaccounts.map((subaccount) => {
                  if (subaccount.id === editingSubaccount?.id) {
                    return (
                      <form
                        key={subaccount.id}
                        action={handleSaveEditSubaccount}
                      >
                        <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                          <div className="min-w-0 flex-auto">
                            <div className="flex items-center gap-x-3">
                              <Input
                                id="subaccount"
                                name="subaccount"
                                placeholder="Edit subaccount"
                                defaultValue={subaccount.name}
                                disabled={isSaving}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              type="submit"
                              disabled={isSaving}
                            >
                              <CheckIcon
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isSaving}
                              onClick={() => setEditingSubaccount(undefined)}
                            >
                              <XMarkIcon
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  disabled={isSaving}
                                >
                                  <TrashIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your subaccount.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteSubaccount(subaccount.id)
                                    }
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </li>
                      </form>
                    );
                  }
                  return (
                    <li
                      key={subaccount.id}
                      className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
                    >
                      <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                          <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-black">
                            {subaccount.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setEditingSubaccount(subaccount)}
                        >
                          Edit
                        </Button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
