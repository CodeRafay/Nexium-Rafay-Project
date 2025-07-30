import "./globals.css";
import { Card, CardContent } from "@/components/ui/card";
import { AuthProvider } from "../lib/auth-context";
import { Header } from "../components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Card className="max-w-3xl mx-auto mt-8">
            <CardContent className="p-6">
              <Header />
              <main>{children}</main>
            </CardContent>
          </Card>
        </AuthProvider>
      </body>
    </html>
  );
}
