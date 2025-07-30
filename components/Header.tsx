'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const handleAuthAction = () => {
        if (user) {
            signOut();
            router.push('/login');
        } else {
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Recipe Generator</h1>
                <div className="text-gray-500">Loading...</div>
            </header>
        );
    }

    return (
        <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Recipe Generator</h1>
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-gray-600">
                        Welcome, {user.email}
                    </span>
                )}
                <Button
                    variant={user ? "outline" : "default"}
                    onClick={handleAuthAction}
                >
                    {user ? 'Sign Out' : 'Sign In'}
                </Button>
            </div>
        </header>
    );
} 