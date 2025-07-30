'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

export default function CallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        let unsub: any;
        let timeout: NodeJS.Timeout;

        const checkSession = async () => {
            let { data: { session }, error } = await supabase.auth.getSession();
            console.log('Initial session:', session, error);

            if (session && session.user) {
                setStatus('Authentication successful! Redirecting...');
                timeout = setTimeout(() => router.push('/recipes/generate'), 1000);
                return;
            }

            unsub = supabase.auth.onAuthStateChange((_event, session) => {
                console.log('onAuthStateChange:', session);
                if (session && session.user) {
                    setStatus('Authentication successful! Redirecting...');
                    timeout = setTimeout(() => router.push('/recipes/generate'), 1000);
                }
            });

            timeout = setTimeout(() => {
                setStatus('No user found');
                router.push('/login');
            }, 5000);
        };

        checkSession();

        return () => {
            if (unsub && unsub.data && unsub.data.subscription) {
                unsub.data.subscription.unsubscribe();
            }
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authentication</h1>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
}