'use client';
import { Logo } from '@/components/core/Logo';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SIDEBAR_NAVIGATION } from './constants';
import { NavigationItem } from './NavigationItem';

const { navigation, configuration } = SIDEBAR_NAVIGATION;

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" aria-label="Home">
          <Logo className="h-6 w-auto" />
        </Link>
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
              {configuration.map((item: any) => (
                <NavigationItem
                  key={item.name}
                  item={item}
                  current={pathname === item.href}
                  subItem={type}
                />
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}
