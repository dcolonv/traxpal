import { StatusEnum } from './enums';

export type SubcategoryType = {
  id: string;
  category_id: string;
  name: string;
  status: StatusEnum;
  created_at: string;
};

export type CategoryType = {
  id: string;
  name: string;
  status: StatusEnum;
  organization_id: string;
  created_at: string;
  subcategories?: SubcategoryType[];
};
