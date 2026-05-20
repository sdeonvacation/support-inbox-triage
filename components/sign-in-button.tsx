'use client';

import { AuroraButton } from '@/components/ui/aurora-button';
import { createClient } from '@/lib/supabase';

export function SignInButton() {
  const handleSignIn = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  };

  return (
    <AuroraButton onClick={handleSignIn} className="text-sm font-semibold px-5 py-2">
      Sign In
    </AuroraButton>
  );
}
