'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { generateRecipe } from '../services/recipeService';
import RecipeCard from './RecipeCard';

export default function RecipeGeneratorForm() {
    const [ingredientsInput, setIngredientsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recipe, setRecipe] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setRecipe(null);
        setLoading(true);
        try {
            const ingredients = ingredientsInput
                .split(/,|\n/)
                .map((i) => i.trim())
                .filter(Boolean);
            if (ingredients.length === 0) {
                setError('Please enter at least one ingredient.');
                setLoading(false);
                return;
            }
            const result = await generateRecipe(ingredients);
            setRecipe(result);
        } catch (err) {
            setError('Failed to generate recipe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="ingredients" className="block font-medium mb-1">
                    Ingredients (comma-separated or line-by-line)
                </label>
                <Textarea
                    id="ingredients"
                    value={ingredientsInput}
                    onChange={(e) => setIngredientsInput(e.target.value)}
                    placeholder="e.g. tomato, cheese, basil\nor\ntomato\ncheese\nbasil"
                    rows={4}
                    className="resize-y"
                />
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Generating...' : 'Generate Recipe'}
                </Button>
            </form>
            {loading && (
                <div className="mt-6">
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            )}
            {recipe && !loading && (
                <div className="mt-6">
                    <RecipeCard
                        title={recipe.title}
                        description={
                            `<strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}<br/>` +
                            `<strong>Instructions:</strong> ${recipe.instructions.join(' ')}<br/>` +
                            `<strong>Prep Time:</strong> ${recipe.prepTime}, <strong>Cook Time:</strong> ${recipe.cookTime}`
                        }
                    />
                </div>
            )}
        </Card>
    );
}
