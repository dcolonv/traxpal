export type SubaccountType = {
  id: string;
  account_id: string;
  name: string;
  user_id: string;
  created_at: string;
};

export type AccountType = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  subaccounts?: SubaccountType[];
};
