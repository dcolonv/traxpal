import AuthButton from '@/components/root/AuthButton';
import { BellIcon } from '@heroicons/react/24/outline';

import { MobileNavigation } from './MobileNavitation';
import { Sidebar } from './Sidebar';

export function NavigationFrame() {
  return (
    <div>
      {/* Top Navbar */}
      <div className="lg:pl-72">
        <div className="fixed left-0 right-0 top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <MobileNavigation />

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
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
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
