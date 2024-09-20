'use client';

import { type OrganizationType } from '@/lib/types/organizations';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type OrganizationContextType = {
  organization?: OrganizationType;
  organizations?: OrganizationType[];
  changeOrganization?: (orgId: string) => void;
};

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined);

export default function OrganizationProvider({
  organizations,
  children,
}: {
  organizations: OrganizationType[];
  children: React.ReactNode;
}) {
  const [organization, setOrganization] = useState<OrganizationType>();

  useEffect(() => {
    if (organizations) {
      setOrganization(organizations[0]);
    }
  }, [organizations]);

  const changeOrganization = useCallback(
    (orgId: string) => {
      const newOrg = organizations.find((org) => org.id === orgId);
      setOrganization(newOrg);
    },
    [organizations],
  );

  const contextValue = useMemo(
    () => ({
      organization,
      organizations,
      changeOrganization,
    }),
    [changeOrganization, organization, organizations],
  );

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within a OrganizationProvider',
    );
  }
  return context;
};
