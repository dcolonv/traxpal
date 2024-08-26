'use server';

import { type AccountType } from '@/lib/types/accounts';
import { createClient } from '@/utils/supabase/server';

export async function fetchAccountsWithSubaccounts(): Promise<AccountType[]> {
  const supabase = createClient();
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select(`*, subaccounts(*)`)
    .eq('status', 'active')
    .eq('subaccounts.status', 'active')
    .order('id', { referencedTable: 'subaccounts', ascending: false })
    .order('id', { ascending: false });

  if (accountsError) {
    console.error('Error fetching accounts:', accountsError);
    throw accountsError;
  }

  return accounts;
}

export async function addAccount({ name }: { name: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('accounts')
    .insert({ name })
    .select();

  if (error) {
    return { success: false, error };
  }

  return { success: true, account: data[0] };
}

export async function updateAccount({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('accounts')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, account: data[0] };
}

export async function removeAccount({ id }: { id: string }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('accounts')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
