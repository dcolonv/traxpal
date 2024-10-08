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
  date: Date;
  reference: string;
  description: string;
  debit: string;
  credit: string;
};

export type StatementTransactionErrorType = {
  category?: string;
  subcategory?: string;
  clientProvider?: string;
};

export type StatementTransactionType = {
  date: Date;
  description: string;
  credit: string;
  debit: string;
  reference: string;
  category?: CategoryType;
  subcategory?: SubcategoryType;
  clientProvider?: ClientProviderType;
  detail?: string;
  error?: StatementTransactionErrorType;
  bankAccount?: string;
  bankName?: string;
  currency?: string;
};

export type StatementInformationErrorType = {
  bankAccount?: string;
  bankName?: string;
  currency?: string;
};

export type StatementInformationType = {
  bankAccount: string;
  bankName: string;
  currency: string;
  error?: StatementInformationErrorType;
};
