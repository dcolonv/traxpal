import { signIn } from '@/actions/database/auth';
import { TextField } from '@/components/core/Fields';
import { SubmitButton } from '@/components/core/SubmitButton';
import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <>
      <h2 className="mt-10 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>{' '}
        for a free trial.
      </p>
      <form className="mt-8 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <div>
          {searchParams?.message && (
            <p className="p-4 text-center text-foreground">
              {searchParams.message}
            </p>
          )}
          <SubmitButton formAction={signIn} pendingText="Signing In...">
            Sign In <span aria-hidden="true">&nbsp;&rarr;</span>
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
