import { TextField } from '@/components/core/Fields';
import { SubmitButton } from '@/components/core/SubmitButton';
import { type Metadata } from 'next';
import Link from 'next/link';
import { signUp } from '../actions';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function Register({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <>
      <h2 className="mt-10 text-lg font-semibold text-gray-900">
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>{' '}
        to your account.
      </p>
      <form
        action="#"
        className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2"
      >
        <TextField
          label="First name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          required
        />
        <TextField
          label="Last name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          required
        />
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          className="col-span-full"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <div className="col-span-full">
          {searchParams?.message && (
            <p className="p-4 text-center text-foreground">
              {searchParams.message}
            </p>
          )}
          <SubmitButton formAction={signUp} pendingText="Signing Up...">
            Sign Up <span aria-hidden="true">&nbsp;&rarr;</span>
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
