'use client';
import "./globals.css";
import { Card, CardContent } from "@/components/ui/card";
import { AuthProvider } from "../lib/auth-context";
import { Header } from "../components/Header";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Card className="max-w-3xl mx-auto mt-8">
            <CardContent className="p-6">
              <Header />
              <Navbar />
              <main>{children}</main>
            </CardContent>
          </Card>
        </AuthProvider>
      </body>
    </html>
  );
}

function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white mb-8">
      <Link href="/recipes/generate" className="font-bold text-xl text-primary">🍳 RecipeGen</Link>
      <div className="flex items-center gap-4">
        <Link href="/recipes/saved" className="text-base font-medium hover:underline">Saved Recipes</Link>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
