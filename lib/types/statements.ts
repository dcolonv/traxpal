import { CategoryType, SubcategoryType } from './categories';
import { ClientProviderType } from './client_providers';

export type StatementHeaderType = {
  date: string;
  reference: string;
  description: string;
  debit: string;
  credit: string;
};

export type StatementType = {
  date: string;
  reference: string;
  description: string;
  debit: string;
  credit: string;
};

export type BankTransactionType = {
  date: string;
  description: string;
  credit: string;
  debit: string;
  reference: string;
  category?: CategoryType;
  subcategory?: SubcategoryType;
  clientProvider?: ClientProviderType;
  detail?: string;
};

export type StatementInformationType = {
  bankAccount: string;
  bankName: string;
  currency: string;
};
