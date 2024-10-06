import { BellIcon } from '@heroicons/react/24/outline';

import AuthButton from '../root/AuthButton';
import { MobileNavigation } from './MobileNavitation';
import { Sidebar } from './Sidebar';

export function NavigationFrame() {
  return (
    <div>
      {/* Top Navbar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {/** Left nav */}
        <div className="block flex items-center gap-x-4 sm:gap-x-6 lg:hidden">
          <MobileNavigation />
          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />
        </div>

        {/** Center nav */}
        <div className="flex items-center gap-x-4 p-0 sm:gap-x-6 lg:pl-72"></div>

        {/** Right nav */}
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200" />
          {/* Profile dropdown */}
          <AuthButton />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-4 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
