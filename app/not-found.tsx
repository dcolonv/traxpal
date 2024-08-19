import Link from 'next/link';

import { Button } from '@/components/core/Button';
import { Logo } from '@/components/core/Logo';

export default function NotFound() {
  return (
    <>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button href="/" className="mt-10">
        Go back home
      </Button>
    </>
  );
}
