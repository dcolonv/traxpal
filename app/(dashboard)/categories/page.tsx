import { fetchCategoriesWithSubcategories } from '@/actions/database/categories';
import CategoriesController from '@/components/categories/CategoriesController';

export default async function CategoriesPage() {
  const categories = await fetchCategoriesWithSubcategories();

  return <CategoriesController categories={categories} />;
}
