
'use client';

import { useEffect, useState } from 'react';
import SavedRecipeItem from '../../../components/SavedRecipeItem';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  createdAt: string;
}

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/saved-recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch {
      setError('Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete recipe:', id);
    // For now, just remove from local state
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
        {recipes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No recipes saved yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Generate some recipes first and they&apos;ll appear here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <SavedRecipeItem
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                ingredients={recipe.ingredients}
                instructions={recipe.instructions}
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}