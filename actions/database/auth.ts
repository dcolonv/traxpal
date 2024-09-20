'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/register/api/callback`,
      data: {
        first_name,
        last_name,
      },
    },
  });

  if (error) {
    console.log({ error });
    return redirect('/register?message=Could not authenticate user');
  }

  return redirect('/register?message=Check email to continue sign in process');
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/dashboard');
}

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/login');
};

export const fetchUser = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
