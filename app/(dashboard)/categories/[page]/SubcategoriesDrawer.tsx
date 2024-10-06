'use client';

import { removeSubcategory } from '@/actions/database/subcategories';
import RemoveDialog from '@/components/core/RemoveDialog';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types/categories';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import SubcategoryFormDialog from './SubcategoryFormDialog';

interface SubcategoriesDrawerProps {
  category: CategoryType;
}

export default function SubcategoriesDrawer({
  category,
}: SubcategoriesDrawerProps) {
  const [open, setOpen] = useState(false);
  const { name, subcategories = [] } = category;
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <span className="mr-2 hidden md:block">
          {subcategories.length || 0} Subcategories
        </span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white pt-16 shadow-xl">
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle>
                        <p className="truncate text-base font-semibold leading-6 text-gray-900">
                          {name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          Subcategories
                        </p>
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul
                    role="list"
                    className="flex-1 divide-y divide-gray-200 overflow-y-auto"
                  >
                    {!!subcategories.length &&
                      subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <div className="group relative flex items-center px-5 py-6">
                            <div className="-m-1 block flex-1 p-1">
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 group-hover:bg-gray-50"
                              />
                              <div className="relative flex min-w-0 flex-1 items-center">
                                <div className="ml-4 truncate">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {subcategory.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="relative whitespace-nowrap text-right text-sm font-medium">
                              <SubcategoryFormDialog
                                key={subcategory.name}
                                category={category}
                                defaultSubcategory={subcategory}
                              >
                                <Button variant="outline" className="mr-4">
                                  Edit
                                </Button>
                              </SubcategoryFormDialog>
                              <RemoveDialog
                                id={subcategory.id}
                                name={subcategory.name}
                                remove={removeSubcategory}
                              >
                                <Button variant="destructive">Remove</Button>
                              </RemoveDialog>
                            </div>
                          </div>
                        </li>
                      ))}
                    <li>
                      <div className="group relative flex items-center justify-center px-5 py-6">
                        <div className="relative whitespace-nowrap">
                          <SubcategoryFormDialog category={category}>
                            <Button variant="ghost" className="mr-4">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
                                <PlusIcon
                                  aria-hidden="true"
                                  className="h-5 w-5"
                                />
                              </span>
                              <span className="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                                Add new subcategory
                              </span>
                            </Button>
                          </SubcategoryFormDialog>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
