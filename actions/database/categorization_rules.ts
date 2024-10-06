'use server';

import { CategorizationRuleType } from '@/lib/types/categorization_rules';
import { createClient } from '@/utils/supabase/server';

export async function fetchCategorizationRules(
  page: number = 1,
  itemsPerPage: number = 25,
): Promise<{
  categorization_rules: CategorizationRuleType[];
  count: number | null;
  pages: number;
  error?: boolean;
}> {
  const supabase = createClient();

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const {
    data: categorization_rules,
    error,
    count,
  } = await supabase
    .from('categorization_rules')
    .select('*, categories(*), subcategories(*)', { count: 'exact' })
    .eq('status', 'active')
    .range(start, end)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching categorization rules:', error);
    return {
      categorization_rules: [],
      count: 0,
      pages: 0,
      error: true,
    };
  }

  // Map to extract categories and subcategories
  const mappedCategorizationRules = categorization_rules.map((cr) => ({
    ...cr,
    category: cr.categories,
    subcategory: cr.subcategories,
    categories: undefined,
    subcategories: undefined,
  }));

  return {
    categorization_rules: mappedCategorizationRules,
    count,
    pages: Math.ceil((count || 0) / itemsPerPage),
  };
}

export async function fetchAllCategorizationRules(): Promise<{
  categorization_rules: CategorizationRuleType[];
  error?: boolean;
}> {
  const supabase = createClient();

  const { data: categorization_rules, error } = await supabase
    .from('categorization_rules')
    .select('*, categories(*), subcategories(*)')
    .eq('status', 'active')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching all categorization rules:', error);
    return {
      categorization_rules: [],
      error: true,
    };
  }

  // Map to extract categories and subcategories
  const mappedCategorizationRules = categorization_rules.map((cr) => ({
    ...cr,
    category: cr.categories,
    subcategory: cr.subcategories,
    categories: undefined,
    subcategories: undefined,
  }));

  return {
    categorization_rules: mappedCategorizationRules,
  };
}

export async function addCategorizationRule({
  rule,
  criteria,
  category_id,
  subcategory_id,
  organization_id,
}: {
  rule: string;
  criteria: string;
  category_id: number;
  subcategory_id: number;
  organization_id: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categorization_rules')
    .insert({ rule, criteria, category_id, subcategory_id, organization_id })
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, category: data[0] };
}

export async function updateCategorizationRule({
  id,
  rule,
  criteria,
  category_id,
  subcategory_id,
}: {
  id: number;
  rule: string;
  criteria: string;
  category_id: number;
  subcategory_id: number;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categorization_rules')
    .update({ rule, criteria, category_id, subcategory_id })
    .eq('id', id)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, category: data[0] };
}

export async function removeCategorizationRule({ id }: { id: number }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('categorization_rules')
    .update({ status: 'removed' })
    .eq('id', id);

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true };
}
