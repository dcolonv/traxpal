'use client';

import {
  addCategory,
  removeCategory,
  updateCategory,
} from '@/actions/database/categories';
import {
  addSubcategory,
  removeSubcategory,
  updateSubcategory,
} from '@/actions/database/subcategories';
import { CategoryType, SubcategoryType } from '@/lib/types/categories';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useOrganization } from '../providers/OrganizationProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import EmptyState from './EmptyState';

export default function CategoriesController({
  categories,
}: {
  categories: CategoryType[];
}) {
  const { organization } = useOrganization();
  const [displayedCategories, setDisplayedCategories] = useState<
    CategoryType[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();

  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [addingNewSubcategory, setAddingNewSubcategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType>();
  const [editingSubcategory, setEditingSubcategory] =
    useState<SubcategoryType>();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (categories && organization) {
      const orgCategories = categories.filter((cat) => cat.organization_id);
      setDisplayedCategories(orgCategories);
    }
  }, [organization, categories]);

  const handleSaveNewCategory = async (formData: FormData) => {
    const name = (formData.get('category') as string).trim();
    if (name && organization) {
      setIsSaving(true);
      const { category } = await addCategory({
        name,
        organization_id: organization.id,
      });
      if (category) {
        setDisplayedCategories([category, ...displayedCategories]);
      }
      setAddingNewCategory(false);
      setIsSaving(false);
    }
  };

  const handleSaveEditCategory = async (formData: FormData) => {
    const name = (formData.get('category') as string).trim();
    if (name && editingCategory) {
      setIsSaving(true);
      const { category } = await updateCategory({
        id: editingCategory.id,
        name,
      });
      if (category) {
        const catIdx = displayedCategories.findIndex(
          (cat) => cat.id === category.id,
        );
        const oldCategory = displayedCategories[catIdx];
        setDisplayedCategories([
          ...displayedCategories.slice(0, catIdx),
          { ...oldCategory, ...category },
          ...displayedCategories.slice(catIdx + 1),
        ]);
        if (selectedCategory?.id === category.id) {
          setSelectedCategory({ ...oldCategory, ...category });
        }
      }
      setEditingCategory(undefined);
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (id) {
      setIsSaving(true);
      const { success } = await removeCategory({ id });
      if (success) {
        const catIdx = displayedCategories.findIndex((cat) => cat.id === id);
        setDisplayedCategories([
          ...displayedCategories.slice(0, catIdx),
          ...displayedCategories.slice(catIdx + 1),
        ]);
        if (selectedCategory?.id === id) {
          setSelectedCategory(undefined);
        }
      }
      setEditingCategory(undefined);
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(undefined);
    setAddingNewSubcategory(false);
  };

  const handleSaveNewSubcategory = async (formData: FormData) => {
    const name = (formData.get('subcategory') as string).trim();
    if (name) {
      setIsSaving(true);
      const { subcategory } = await addSubcategory({
        category_id: selectedCategory?.id as string,
        name,
      });

      if (subcategory) {
        const catIdx = displayedCategories.findIndex(
          (cat) => cat.id === selectedCategory?.id,
        );
        const category = displayedCategories[catIdx];
        category.subcategories = [
          subcategory,
          ...(category.subcategories || []),
        ];
        setDisplayedCategories([
          ...displayedCategories.slice(0, catIdx),
          category,
          ...displayedCategories.slice(catIdx + 1),
        ]);
      }

      setAddingNewSubcategory(false);
      setIsSaving(false);
    }
  };

  const handleSaveEditSubcategory = async (formData: FormData) => {
    const name = (formData.get('subcategory') as string).trim();
    if (name && editingSubcategory) {
      setIsSaving(true);
      const { subcategory } = await updateSubcategory({
        id: editingSubcategory.id,
        name,
      });
      if (subcategory) {
        const catIdx = displayedCategories.findIndex(
          (cat) => cat.id === subcategory.category_id,
        );
        const category = displayedCategories[catIdx];
        if (category.subcategories) {
          const subcatIdx = category.subcategories.findIndex(
            (subcat) => subcat.id === subcategory.id,
          );
          const editedCategory = {
            ...category,
            subcategories: [
              ...category.subcategories.slice(0, subcatIdx),
              subcategory,
              ...category.subcategories.slice(subcatIdx + 1),
            ],
          };
          setDisplayedCategories([
            ...displayedCategories.slice(0, catIdx),
            editedCategory,
            ...displayedCategories.slice(catIdx + 1),
          ]);
          if (selectedCategory?.id === editedCategory.id) {
            setSelectedCategory(editedCategory);
          }
        }
      }
      setEditingSubcategory(undefined);
      setIsSaving(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (id) {
      setIsSaving(true);
      const { success } = await removeSubcategory({ id });
      if (success) {
        const catIdx = displayedCategories.findIndex(
          (cat) => cat.id === selectedCategory?.id,
        );
        const category = displayedCategories[catIdx];
        const editedCategory = {
          ...category,
          subcategories: (category.subcategories || []).filter(
            (subcat) => subcat.id !== id,
          ),
        };
        setDisplayedCategories([
          ...displayedCategories.slice(0, catIdx),
          editedCategory,
          ...displayedCategories.slice(catIdx + 1),
        ]);
        if (selectedCategory?.id === editedCategory.id) {
          setSelectedCategory(editedCategory);
        }
      }
      setEditingSubcategory(undefined);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={`relative overflow-y-auto pb-10 transition-all duration-300 ease-in-out ${
          selectedCategory
            ? 'w-[0%] border-r border-black/5 lg:w-[50%]'
            : 'w-full'
        }`}
      >
        <main>
          <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-black">
              Categories
            </h1>

            <Button onClick={() => setAddingNewCategory(true)}>
              <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
              New <span className="hidden md:block">&nbsp;Category</span>
            </Button>
          </header>

          {/* Categories list */}
          <ul role="list" className="divide-y divide-black/5">
            {addingNewCategory && (
              <form action={handleSaveNewCategory}>
                <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                      <Input
                        id="category"
                        name="category"
                        placeholder="New category"
                        disabled={isSaving}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      type="submit"
                      disabled={isSaving}
                    >
                      <CheckIcon aria-hidden="true" className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={isSaving}
                      onClick={() => setAddingNewCategory(false)}
                    >
                      <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              </form>
            )}
            {!displayedCategories?.length && !addingNewCategory ? (
              <EmptyState
                title="No categories yet"
                subtitle="Get started by creating a new one."
                action="New Category"
                onClick={() => setAddingNewCategory(true)}
              />
            ) : (
              displayedCategories.map((category) => {
                if (category.id === editingCategory?.id) {
                  return (
                    <form key={category.id} action={handleSaveEditCategory}>
                      <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            <Input
                              id="category"
                              name="category"
                              placeholder="Edit category"
                              defaultValue={category.name}
                              disabled={isSaving}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            type="submit"
                            disabled={isSaving}
                          >
                            <CheckIcon aria-hidden="true" className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isSaving}
                            onClick={() => setEditingCategory(undefined)}
                          >
                            <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                disabled={isSaving}
                              >
                                <TrashIcon
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your category and remove
                                  all subcategories.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    </form>
                  );
                }
                return (
                  <li
                    key={category.id}
                    className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
                  >
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <h2 className="min-w-0 text-sm leading-6 text-gray-600">
                          <span className="truncate">{category.name}</span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="mr-2 hidden md:block">
                          {category.subcategories?.length || 0} Subcategories
                        </span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </main>
      </div>

      <div
        className={`relative overflow-y-auto bg-white transition-all duration-300 ease-in-out ${
          selectedCategory ? 'w-[100%] opacity-100 lg:w-[50%]' : 'w-0 opacity-0'
        }`}
      >
        {selectedCategory && (
          <aside>
            <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeftIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex flex-col items-center">
                <h2 className="text-base font-semibold leading-7 text-black">
                  {selectedCategory.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">Subcategories</p>
              </div>
              <Button onClick={() => setAddingNewSubcategory(true)}>
                <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                New
              </Button>
            </header>
            <ul role="list" className="divide-y divide-black/5">
              {addingNewSubcategory && (
                <form action={handleSaveNewSubcategory}>
                  <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <Input
                          id="subcategory"
                          name="subcategory"
                          placeholder="New subcategory"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        type="submit"
                        disabled={isSaving}
                      >
                        <CheckIcon aria-hidden="true" className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isSaving}
                        onClick={() => setAddingNewSubcategory(false)}
                      >
                        <XMarkIcon aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                </form>
              )}
              {!selectedCategory.subcategories?.length ? (
                <EmptyState
                  title={`No subcategories yet`}
                  subtitle="Create a new subcategory."
                  action="New subcategory"
                  onClick={() => setAddingNewSubcategory(true)}
                />
              ) : (
                selectedCategory.subcategories.map((subcategory) => {
                  if (subcategory.id === editingSubcategory?.id) {
                    return (
                      <form
                        key={subcategory.id}
                        action={handleSaveEditSubcategory}
                      >
                        <li className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                          <div className="min-w-0 flex-auto">
                            <div className="flex items-center gap-x-3">
                              <Input
                                id="subcategory"
                                name="subcategory"
                                placeholder="Edit subcategory"
                                defaultValue={subcategory.name}
                                disabled={isSaving}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              type="submit"
                              disabled={isSaving}
                            >
                              <CheckIcon
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isSaving}
                              onClick={() => setEditingSubcategory(undefined)}
                            >
                              <XMarkIcon
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  disabled={isSaving}
                                >
                                  <TrashIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your subcategory.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteSubcategory(subcategory.id)
                                    }
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </li>
                      </form>
                    );
                  }
                  return (
                    <li
                      key={subcategory.id}
                      className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
                    >
                      <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                          <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-black">
                            {subcategory.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setEditingSubcategory(subcategory)}
                        >
                          Edit
                        </Button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
