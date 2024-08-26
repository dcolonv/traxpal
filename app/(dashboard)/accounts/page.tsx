import { fetchAccountsWithSubaccounts } from '@/actions/database/accounts';
import AccountsController from '@/components/accounts/AccountsController';

export default async function AccountsPage() {
  const accounts = await fetchAccountsWithSubaccounts();

  return <AccountsController accounts={accounts} />;
}
