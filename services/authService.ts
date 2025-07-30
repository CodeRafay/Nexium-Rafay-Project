import { supabase } from '../lib/supabase/client';

export async function signInWithProvider(provider: 'google' | 'github') {
    return supabase.auth.signInWithOAuth({ provider });
}

export async function signOut() {
    return supabase.auth.signOut();
}
