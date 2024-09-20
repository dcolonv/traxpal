'use server';

import { type CategoryType } from '@/lib/types/categories';
import { createClient } from '@/utils/supabase/server';

export async function fetchCategoriesWithSubcategories(): Promise<
  CategoryType[]
> {
  const supabase = createClient();
  const { data: categories, error: accountsError } = await supabase
    .from('categories')
    .select(`*, subcategories(*)`)
    .eq('status', 'active')
    .eq('subcategories.status', 'active')
    .order('id', { referencedTable: 'subcategories', ascending: false })
    .order('id', { ascending: false });

  if (accountsError) {
    console.error('Error fetching categories:', accountsError);
    throw accountsError;
  }

  return categories;
}

export async function addCategory({
  name,
  organization_id,
}: {
  name: string;
  organization_id: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, organization_id })
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, category: data[0] };
}

export async function updateCategory({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, category: data[0] };
}

export async function removeCategory({ id }: { id: string }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('categories')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
