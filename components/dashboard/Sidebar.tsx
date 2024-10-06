'use client';
import { Logo } from '@/components/core/Logo';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { SIDEBAR_NAVIGATION } from './constants';
import { NavigationItem } from './NavigationItem';
import OrganizationSelector from './OrganizationSelector';

const { navigation, configuration } = SIDEBAR_NAVIGATION;

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams<{ type: string }>();
  return (
    <>
      <div className="flex shrink-0 flex-col items-center gap-4 pt-4">
        <Link href="/" aria-label="Home">
          <Logo className="h-6 w-auto" />
        </Link>

        <OrganizationSelector />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.name}
                  item={item}
                  current={pathname === item.href}
                />
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Configuration
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {configuration.map((item: any) => {
                return (
                  <NavigationItem
                    key={item.name}
                    item={item}
                    current={pathname.startsWith(item.href)}
                    subItem={params.type}
                  />
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}
