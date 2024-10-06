'use server';

import { ExchangeRateType } from '@/lib/types/exchange_rates';
import { createClient } from '@/utils/supabase/server';

export async function fetchExchangeRates(
  type: string,
  page: number = 1,
  itemsPerPage: number = 25,
): Promise<{
  exchange_rates: ExchangeRateType[];
  count: number | null;
  pages: number;
}> {
  const supabase = createClient();

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  const {
    data: exchange_rates,
    error,
    count,
  } = await supabase
    .from('exchange_rates')
    .select('*', { count: 'exact' })
    .eq('type', type)
    .range(start, end)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
  return {
    exchange_rates,
    count,
    pages: Math.ceil((count || 0) / itemsPerPage),
  };
}
