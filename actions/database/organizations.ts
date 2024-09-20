'use server';

import { OrganizationType } from '@/lib/types/organizations';
import { createClient } from '@/utils/supabase/server';

export async function fetchOrganizations(): Promise<OrganizationType[]> {
  const supabase = createClient();
  const { data: organizations, error: accountsError } = await supabase
    .from('organizations')
    .select('*')
    .eq('status', 'active');

  if (accountsError) {
    console.error('Error fetching organizations:', accountsError);
    throw accountsError;
  }

  return organizations;
}
