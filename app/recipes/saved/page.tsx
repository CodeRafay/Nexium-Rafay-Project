'use client';

import SavedRecipeItem from '../../../components/SavedRecipeItem';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function SavedRecipesPage() {
    // TODO: Fetch saved recipes
    const recipes = [
        { title: 'Sample Recipe', onDelete: () => { } },
    ];
    return (
        <ProtectedRoute>
            <div className="max-w-xl mx-auto mt-8">
                <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
                {recipes.map((r, i) => (
                    <SavedRecipeItem key={i} {...r} />
                ))}
            </div>
        </ProtectedRoute>
    );
}
