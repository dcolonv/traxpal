'use server';

import { ClientProviderType } from '@/lib/types/client_providers';
import { createClient } from '@/utils/supabase/server';

export async function fetchClientsProviders(
  page: number = 1,
  itemsPerPage: number = 25,
): Promise<{
  clients_providers: ClientProviderType[];
  count: number | null;
  pages: number;
  error?: boolean;
}> {
  const supabase = createClient();

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const {
    data: clients_providers,
    error,
    count,
  } = await supabase
    .from('clients_providers')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .range(start, end)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching clients and providers:', error);
    return {
      clients_providers: [],
      count: 0,
      pages: 0,
      error: true,
    };
  }

  return {
    clients_providers,
    count,
    pages: Math.ceil((count || 0) / itemsPerPage),
  };
}

export async function fetchAllClientsProviders(): Promise<{
  clients_providers: ClientProviderType[];
  error?: boolean;
}> {
  const supabase = createClient();

  const {
    data: clients_providers,
    error,
    count,
  } = await supabase
    .from('clients_providers')
    .select('*')
    .eq('status', 'active')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching all clients and providers:', error);
    return {
      clients_providers: [],
      error: true,
    };
  }

  return {
    clients_providers,
  };
}

export async function addClientProvider({
  name,
  type,
  organization_id,
}: {
  name: string;
  type: string;
  organization_id: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('clients_providers')
    .insert({ name, type, organization_id })
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, client_provider: data[0] };
}

export async function updateClientProvider({
  id,
  name,
  type,
}: {
  id: number;
  name: string;
  type: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('clients_providers')
    .update({ name, type })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, client_provider: data[0] };
}

export async function removeClientProvider({ id }: { id: number }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('clients_providers')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
