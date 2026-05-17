'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';

export function SignInButton() {
  const handleSignIn = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
  };

  return (
    <Button variant="outline" size="sm" className="border-slate-700" onClick={handleSignIn}>
      Sign In
    </Button>
  );
}
