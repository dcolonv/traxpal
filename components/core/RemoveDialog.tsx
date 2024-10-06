'use client';

import { useToast } from '@/components/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface CategoryRemoveDialogProps {
  id: number;
  name: string;
  remove: ({ id }: { id: number }) => Promise<any>;
  children: ReactNode;
}

export default function RemoveDialog({
  id,
  name,
  remove,
  children,
}: CategoryRemoveDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (id) {
      setRemoving(true);
      const result = await remove({ id });

      if (!result.success) {
        toast({
          variant: 'destructive',
          description: `${name} could not be removed.`,
        });
      } else {
        toast({
          description: `${name} was removed.`,
        });
        setOpen(false);
        router.refresh();
      }
      setRemoving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <b>{name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={removing} onClick={handleRemove}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
