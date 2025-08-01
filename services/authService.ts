import { supabase } from '../lib/supabase/client';

export async function signInWithProvider(provider: 'google' | 'github') {
    return supabase.auth.signInWithOAuth({ provider });
}

export async function logout() {
  await supabase.auth.signOut();
}
