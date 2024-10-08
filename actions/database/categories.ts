'use server';

import { type CategoryType } from '@/lib/types/categories';
import { createClient } from '@/utils/supabase/server';

export async function fetchCategories(
  page: number = 1,
  itemsPerPage: number = 25,
): Promise<{
  categories: CategoryType[];
  count: number | null;
  pages: number;
  error?: boolean;
}> {
  const supabase = createClient();

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const {
    data: categories,
    error,
    count,
  } = await supabase
    .from('categories')
    .select('*, subcategories(*)', { count: 'exact' })
    .eq('status', 'active')
    .eq('subcategories.status', 'active')
    .range(start, end)
    .order('id', { referencedTable: 'subcategories', ascending: true })
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching categories:', error);
    return {
      categories: [],
      count: 0,
      pages: 0,
      error: true,
    };
  }

  return { categories, count, pages: Math.ceil((count || 0) / itemsPerPage) };
}

export async function fetchAllCategories(): Promise<{
  categories: CategoryType[];
  error?: boolean;
}> {
  const supabase = createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*, subcategories(*)')
    .eq('status', 'active')
    .eq('subcategories.status', 'active')
    .order('id', { referencedTable: 'subcategories', ascending: true })
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching all categories:', error);
    return {
      categories: [],
      error: true,
    };
  }

  return { categories };
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
  id: number;
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

export async function removeCategory({ id }: { id: number }) {
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
