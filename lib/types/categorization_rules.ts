import { CategoryType, SubcategoryType } from './categories';
import { RuleTypeEnum, StatusEnum } from './enums';

export type CategorizationRuleType = {
  id: number;
  rule: RuleTypeEnum;
  criteria: string;
  category_id: number;
  subcategory_id: number;
  used_count: number;
  organization_id: number;
  status: StatusEnum;
  created_at: string;
  category: CategoryType;
  subcategory: SubcategoryType;
};
