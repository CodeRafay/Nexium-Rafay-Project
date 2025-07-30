import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Recipe Generator</h1>
      <p className="text-lg text-gray-600 mb-8">
        Generate delicious recipes from your available ingredients
      </p>
      <div className="space-x-4">
        <Link href="/recipes/generate">
          <Button>Generate Recipe</Button>
        </Link>
        <Link href="/recipes/saved">
          <Button variant="outline">Saved Recipes</Button>
        </Link>
      </div>
    </div>
  );
}
