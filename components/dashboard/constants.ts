import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAmericasIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export const SIDEBAR_NAVIGATION = {
  navigation: [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Cashflow', href: '#', icon: BanknotesIcon, current: false },
    { name: 'Companies', href: '#', icon: BuildingOffice2Icon, current: false },
    {
      name: 'Bank Accounts',
      href: '#',
      icon: DocumentTextIcon,
      current: false,
    },
    {
      name: 'Documents',
      href: '#',
      icon: DocumentDuplicateIcon,
      current: false,
    },
    { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
  ],
  configuration: [
    {
      name: 'Exchange rates',
      icon: GlobeAmericasIcon,
      current: true,
      children: [{ name: 'USD - CRC', href: '/exchange-rates?type=USD-CR' }],
    },
  ],
};
