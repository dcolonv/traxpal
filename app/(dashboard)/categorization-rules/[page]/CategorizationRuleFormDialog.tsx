'use client';

import {
  addCategorizationRule,
  updateCategorizationRule,
} from '@/actions/database/categorization_rules';
import { useToast } from '@/components/hooks/use-toast';
import { useOrganization } from '@/components/providers/OrganizationProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryType, SubcategoryType } from '@/lib/types/categories';
import { CategorizationRuleType } from '@/lib/types/categorization_rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const FormSchema = z.object({
  rule: z.string().min(1, 'Please select a rule.'),
  criteria: z.string().min(1, 'Please indicate a criteria.'),
  category_id: z.string().min(1, 'Please select a category'),
  subcategory_id: z.string().min(1, 'Please select a sub category.'),
});

interface CategorizationRuleFormDialogProps {
  categories: CategoryType[];
  defaultCategorizationRule?: CategorizationRuleType;
  children: ReactNode;
}

export default function CategorizationRuleFormDialog({
  categories,
  defaultCategorizationRule,
  children,
}: CategorizationRuleFormDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rule: `${defaultCategorizationRule?.rule || 'contains'}`,
      criteria: defaultCategorizationRule?.criteria || '',
      category_id: `${defaultCategorizationRule?.category_id || ''}`,
      subcategory_id: `${defaultCategorizationRule?.subcategory_id || ''}`,
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [availableSubcategories, setAvailableSubcategories] = useState<
    SubcategoryType[]
  >([]);

  useEffect(() => {
    const categoryId = form.getValues('category_id');
    const category = categories.find((c) => c.id.toString() === categoryId);
    setSelectedCategory(category || null);

    if (category) {
      setAvailableSubcategories(category.subcategories || []);
    } else {
      setAvailableSubcategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues('category_id'), categories]);

  useEffect(() => {
    if (defaultCategorizationRule && defaultCategorizationRule.category_id) {
      const category = categories.find(
        (c) => c.id === defaultCategorizationRule.category_id,
      );
      if (category) {
        setSelectedCategory(category);
        setAvailableSubcategories(category.subcategories || []);
      }
    }
  }, [defaultCategorizationRule, categories]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (defaultCategorizationRule?.id) {
        const result = await updateCategorizationRule({
          id: defaultCategorizationRule.id,
          rule: data.rule,
          criteria: data.criteria,
          category_id: parseInt(data.category_id),
          subcategory_id: parseInt(data.subcategory_id),
        });

        if (!result.success) {
          toast({
            variant: 'destructive',
            description: 'Your categorization rule could not be updated.',
          });
        } else {
          toast({
            description: 'Your categorization rule was updated.',
          });
          setOpen(false);
          form.reset();
          router.refresh();
        }
      } else {
        const result = await addCategorizationRule({
          rule: data.rule,
          criteria: data.criteria,
          category_id: parseInt(data.category_id),
          subcategory_id: parseInt(data.subcategory_id),
          organization_id: organization?.id || '',
        });

        if (!result.success) {
          toast({
            variant: 'destructive',
            description: 'Your categorization rule could not be created.',
          });
        } else {
          toast({
            description: 'Your categorization rule was created.',
          });
          setOpen(false);
          form.reset();
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        description: 'An error occurred. Please try again.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Categorization Rule</DialogTitle>
              <DialogDescription>
                {defaultCategorizationRule ? 'Update' : 'Create'} a
                categorization rule to be automatically applied to your
                transactions.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="rule"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Rule
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="rule"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a rule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="start_with">
                              Starts with
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="criteria"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Criteria
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="criteria"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Criteria..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const category = categories.find(
                              (c) => c.id.toString() === value,
                            );
                            setSelectedCategory(category || null);
                            setAvailableSubcategories(
                              category?.subcategories || [],
                            );
                            form.setValue('subcategory_id', '');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={`${category.id}`}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="subcategory_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sub Category
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sub category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubcategories.map((subcategory) => (
                              <SelectItem
                                key={subcategory.id}
                                value={`${subcategory.id}`}
                              >
                                {subcategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
