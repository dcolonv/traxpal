import { ClientProviderTypeEnum, StatusEnum } from './enums';

export type ClientProviderType = {
  id: number;
  name: string;
  type: ClientProviderTypeEnum;
  status: StatusEnum;
  organization_id: number;
  created_at: string;
};
