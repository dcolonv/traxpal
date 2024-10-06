'use client';

import { addCategory, updateCategory } from '@/actions/database/categories';
import { useToast } from '@/components/hooks/use-toast';
import { useOrganization } from '@/components/providers/OrganizationProvider';
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
import { CategoryType } from '@/lib/types/categories';
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

interface CategoryFormDialogProps {
  defaultCategory?: CategoryType;
  children: ReactNode;
}

export default function CategoryFormDialog({
  defaultCategory,
  children,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { organization } = useOrganization();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: defaultCategory?.name || '',
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (defaultCategory?.id) {
      const result = await updateCategory({
        id: defaultCategory.id,
        name: data.name,
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: 'Your category could not be updated.',
        });
      } else {
        toast({
          description: 'Your category was updated.',
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } else {
      const result = await addCategory({
        name: data.name,
        organization_id: organization?.id || '',
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: 'Your category could not be created.',
        });
      } else {
        toast({
          description: 'Your category was created.',
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
              <DialogTitle>Category</DialogTitle>
              <DialogDescription>
                {defaultCategory ? 'Update' : 'Create'} a category for your bank
                transactions.
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
                            placeholder="Category name"
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
