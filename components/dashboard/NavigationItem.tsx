import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

type NavigationItemType = {
  name: string;
  href?: string;
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  children?: {
    name: string;
    href?: string;
    icon: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, 'ref'> & {
        title?: string;
        titleId?: string;
      } & RefAttributes<SVGSVGElement>
    >;
  }[];
};

interface NavigationItemProps {
  item: NavigationItemType;
  current?: boolean;
  subItem?: string | null;
}

export function NavigationItem({
  item,
  current,
  subItem,
}: NavigationItemProps) {
  return (
    <li>
      {!item.children ? (
        <Link
          href={item.href || ''}
          className={clsx(
            current
              ? 'bg-gray-50 text-indigo-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
          )}
        >
          <item.icon
            aria-hidden="true"
            className={clsx(
              current
                ? 'text-indigo-600'
                : 'text-gray-400 group-hover:text-indigo-600',
              'h-6 w-6 shrink-0',
            )}
          />
          {item.name}
        </Link>
      ) : (
        <Disclosure as="div" defaultOpen={current}>
          <DisclosureButton
            className={clsx(
              current
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
              'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700',
            )}
          >
            <item.icon
              aria-hidden="true"
              className="h-6 w-6 shrink-0 text-gray-400"
            />
            {item.name}
            <ChevronRightIcon
              aria-hidden="true"
              className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
            />
          </DisclosureButton>
          <DisclosurePanel as="ul" className="mt-1 px-2">
            {item.children.map((child: any) => {
              return (
                <li key={child.name}>
                  {/* 44px */}
                  <DisclosureButton
                    as={Link}
                    href={child.href}
                    className={clsx(
                      child.subitem === subItem
                        ? 'bg-gray-50'
                        : 'hover:bg-gray-50',
                      'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                    )}
                  >
                    {child.name}
                  </DisclosureButton>
                </li>
              );
            })}
          </DisclosurePanel>
        </Disclosure>
      )}
    </li>
  );
}
