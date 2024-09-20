import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ChartPieIcon,
  CircleStackIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';

export const SIDEBAR_NAVIGATION = {
  navigation: [
    {
      name: 'Cashflow',
      href: '/cashflow',
      icon: BanknotesIcon,
    },
    { name: 'Companies', href: '#', icon: BuildingOffice2Icon },
    {
      name: 'Bank Categories',
      href: '#',
      icon: DocumentTextIcon,
    },
    {
      name: 'Documents',
      href: '#',
      icon: DocumentDuplicateIcon,
    },
    { name: 'Reports', href: '#', icon: ChartPieIcon },
  ],
  configuration: [
    {
      name: 'Exchange rates',
      icon: GlobeAmericasIcon,
      href: '/exchange-rates',
      children: [
        {
          name: 'USD - CRC',
          href: '/exchange-rates?type=USD-CRC',
          subitem: 'USD-CRC',
        },
      ],
    },
    { name: 'Categories', href: '/categories', icon: CircleStackIcon },
  ],
};
