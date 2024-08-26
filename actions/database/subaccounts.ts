'use server';

import { createClient } from '@/utils/supabase/server';

export async function addSubaccount({
  account_id,
  name,
}: {
  account_id: string;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subaccounts')
    .insert({ name, account_id })
    .select();

  if (error) {
    return { success: false, error };
  }

  return { success: true, subaccount: data[0] };
}

export async function updateSubaccount({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subaccounts')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, subaccount: data[0] };
}

export async function removeSubaccount({ id }: { id: string }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('subaccounts')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
