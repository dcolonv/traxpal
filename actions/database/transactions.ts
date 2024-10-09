'use server';

import { StatementTransactionType } from '@/lib/types/statements';
import { createClient } from '@/utils/supabase/server';

export async function addTransactions({
  transactions,
  organization_id,
}: {
  transactions: StatementTransactionType[];
  organization_id: string;
}) {
  const supabase = createClient();

  const mappedTransactions = transactions.map((trx) => ({
    date: trx.date,
    description: trx.description,
    reference: trx.reference,
    debit: trx.debit,
    credit: trx.credit,
    category_id: trx.category?.id,
    subcategory_id: trx.subcategory?.id,
    client_provider_id: trx.clientProvider?.id,
    detail: trx.detail,
    bank_account: trx.bankAccount,
    bank_name: trx.bankName,
    currency: trx.currency,
    organization_id,
    debit_usd: trx.debit_usd,
    credit_usd: trx.credit_usd,
    exchange_rate: trx.exchange_rate,
  }));

  const { data, error } = await supabase
    .from('transactions')
    .insert(mappedTransactions)
    .select();

  if (error) {
    console.log({ error });
    return { success: false, error };
  }

  return { success: true, transactions: data[0] };
}
