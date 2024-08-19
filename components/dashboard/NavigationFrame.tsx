import { Logo } from '@/components/core/Logo';
import AuthButton from '@/components/root/AuthButton';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';
import Link from 'next/link';
import { SIDEBAR_NAVIGATION } from './constants';
import { MobileNavigation } from './MobileNavitation';

const { navigation, configuration } = SIDEBAR_NAVIGATION;

export function NavigationFrame() {
  return (
    <div>
      {/* Top Navbar */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <MobileNavigation />

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="relative flex flex-1">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              />
              <input
                id="search-field"
                name="search"
                type="search"
                placeholder="Search..."
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              />

              {/* Profile dropdown */}
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-8 overflow-y-auto border-r border-gray-200 bg-white px-6">
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
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={clsx(
                          item.current
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={clsx(
                            item.current
                              ? 'text-indigo-600'
                              : 'text-gray-400 group-hover:text-indigo-600',
                            'h-6 w-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Configuration
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {configuration.map((item: any) => (
                    <li key={item.name}>
                      {!item.children ? (
                        <a
                          href={item.href || ''}
                          className={clsx(
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={clsx(
                              item.current
                                ? 'text-indigo-600'
                                : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0',
                            )}
                          />
                          {item.name}
                        </a>
                      ) : (
                        <Disclosure as="div" defaultOpen={item.current}>
                          <DisclosureButton
                            className={clsx(
                              item.current
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
                            {item.children.map((subItem: any) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <DisclosureButton
                                  as="a"
                                  href={subItem.href}
                                  className={clsx(
                                    subItem.current
                                      ? 'bg-gray-50'
                                      : 'hover:bg-gray-50',
                                    'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                  )}
                                >
                                  {subItem.name}
                                </DisclosureButton>
                              </li>
                            ))}
                          </DisclosurePanel>
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
