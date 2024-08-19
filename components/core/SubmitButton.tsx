'use client';

import clsx from 'clsx';
import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './Button';

type Props = ComponentProps<'button'> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button
      {...props}
      type="submit"
      aria-disabled={pending}
      variant="solid"
      color="blue"
      className={clsx(props.className, 'w-full')}
    >
      {isPending ? pendingText : children}
    </Button>
  );
}
