'use client';

import {
  addClientProvider,
  updateClientProvider,
} from '@/actions/database/clients_providers';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientProviderType } from '@/lib/types/client_providers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const FormSchema = z.object({
  type: z.string({
    required_error: 'Please select a type.',
  }),
  name: z.string({
    required_error: 'Please indicate a name.',
  }),
});

interface ClientProviderFormDialogProps {
  defaultClientProvider?: ClientProviderType;
  children: ReactNode;
}

export default function ClientProviderFormDialog({
  defaultClientProvider,
  children,
}: ClientProviderFormDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { organization } = useOrganization();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: defaultClientProvider?.name || '',
      type: `${defaultClientProvider?.type || ''}`,
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (defaultClientProvider?.id) {
      const result = await updateClientProvider({
        id: defaultClientProvider.id,
        name: data.name,
        type: data.type,
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: `Your ${data.type} could not be updated.`,
        });
      } else {
        toast({
          description: `Your ${data.type} was updated.`,
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } else {
      const result = await addClientProvider({
        name: data.name,
        type: data.type,
        organization_id: organization?.id || '',
      });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: `Your ${data.type} could not be created.`,
        });
      } else {
        toast({
          description: `Your ${data.type} was created.`,
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
              <DialogTitle>Client or Provider</DialogTitle>
              <DialogDescription>
                {defaultClientProvider ? 'Update' : 'Create'} a client or
                provider.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-6 sm:py-0">
              <div className="sm:col-span-2">
                <label
                  htmlFor="rule"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Type
                </label>
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="provider">Provider</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
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
                            placeholder="Provider or Client name"
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
