'use client';

import {
  addSubcategory,
  updateSubcategory,
} from '@/actions/database/subcategories';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import { CategoryType, SubcategoryType } from '@/lib/types/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const FormSchema = z.object({
  name: z.string({
    required_error: 'Please indicate a name.',
  }),
});

interface SubcategoryFormDialogProps {
  defaultSubcategory?: SubcategoryType;
  category: CategoryType;
  children: ReactNode;
}

export default function SubcategoryFormDialog({
  defaultSubcategory,
  category,
  children,
}: SubcategoryFormDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: defaultSubcategory?.name || '',
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (defaultSubcategory?.id) {
      const result = await updateSubcategory({
        id: defaultSubcategory.id,
        name: data.name,
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: 'Your subcategory could not be updated.',
        });
      } else {
        toast({
          description: 'Your subcategory was updated.',
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } else {
      const result = await addSubcategory({
        name: data.name,
        category_id: category.id,
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: 'Your subcategory could not be created.',
        });
      } else {
        toast({
          description: 'Your subcategory was created.',
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
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
              <DialogTitle>Subategory for {category.name}</DialogTitle>
              <DialogDescription>
                {defaultSubcategory ? 'Update' : 'Create'} a subcategory for
                your bank transactions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-6 sm:py-0">
              <div className="sm:col-span-6">
                <label
                  htmlFor="criteria"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Subcategory name"
                            required
                            {...field}
                          />
                        </FormControl>
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
