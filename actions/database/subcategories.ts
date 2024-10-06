'use server';

import { createClient } from '@/utils/supabase/server';

export async function addSubcategory({
  category_id,
  name,
}: {
  category_id: number;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subcategories')
    .insert({ name, category_id })
    .select();

  if (error) {
    return { success: false, error };
  }

  return { success: true, subcategory: data[0] };
}

export async function updateSubcategory({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subcategories')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, subcategory: data[0] };
}

export async function removeSubcategory({ id }: { id: number }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('subcategories')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
