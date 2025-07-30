import RecipeGeneratorForm from '../../../components/RecipeGeneratorForm';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function GenerateRecipePage() {
    return (
        <ProtectedRoute>
            <div className="max-w-xl mx-auto mt-8">
                <h2 className="text-xl font-bold mb-4">Generate a Recipe</h2>
                <RecipeGeneratorForm />
            </div>
        </ProtectedRoute>
    );
}
