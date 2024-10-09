import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAmericasIcon,
  ListBulletIcon,
  SwatchIcon,
  UsersIcon,
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
          href: '/exchange-rates/USD-CRC/1',
          subitem: 'USD-CRC',
        },
      ],
    },
    {
      name: 'Clients and Providers',
      href: '/client-providers/1',
      icon: UsersIcon,
    },
    { name: 'Categories', href: '/categories/1', icon: ListBulletIcon },
    {
      name: 'Categorization Rules',
      href: '/categorization-rules/1',
      icon: SwatchIcon,
    },
  ],
};

export const CURRENCY_SYMBOL = {
  USD: '$',
  CRC: '₡',
};
