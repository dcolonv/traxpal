'use client';
import { useOrganization } from '../providers/OrganizationProvider';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrganizationSelector() {
  const { organization, organizations, changeOrganization } = useOrganization();

  return (
    <Select onValueChange={changeOrganization} value={organization?.id}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Organizations</SelectLabel>
          {organizations?.map((org) => (
            <SelectItem value={org.id} key={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
