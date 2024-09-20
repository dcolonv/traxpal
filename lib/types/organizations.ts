import { OrganizationTypeEnum } from './enums';

export type OrganizationType = {
  id: string;
  name: string;
  members: number;
  type: OrganizationTypeEnum;
};
