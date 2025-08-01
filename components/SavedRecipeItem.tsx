import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedRecipeItemProps {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    onDelete: (id: string) => void;
}

export default function SavedRecipeItem({
    id,
    title,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    onDelete
}: SavedRecipeItemProps) {
    const ingredientsSummary = ingredients.slice(0, 3).join(', ') + (ingredients.length > 3 ? '...' : '');
    const instructionsSummary = instructions.slice(0, 2).join('. ') + (instructions.length > 2 ? '...' : '');

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(id)}
                    >
                        Delete
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <span className="font-medium text-sm">Ingredients:</span>
                        <p className="text-sm text-gray-600">{ingredientsSummary}</p>
                    </div>
                    <div>
                        <span className="font-medium text-sm">Instructions:</span>
                        <p className="text-sm text-gray-600">{instructionsSummary}</p>
                    </div>
                    {(prepTime || cookTime) && (
                        <div className="text-xs text-gray-500">
                            {prepTime && <span>Prep: {prepTime}</span>}
                            {prepTime && cookTime && <span> &middot; </span>}
                            {cookTime && <span>Cook: {cookTime}</span>}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
