import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecipeCard({ title, description, prepTime, cookTime }: {
    title: string;
    description: string;
    prepTime?: string;
    cookTime?: string;
}) {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose" dangerouslySetInnerHTML={{ __html: description }} />
                {(prepTime || cookTime) && (
                    <div className="mt-2 text-sm text-gray-500">
                        {prepTime && <span>Prep Time: {prepTime}</span>}
                        {prepTime && cookTime && <span> &middot; </span>}
                        {cookTime && <span>Cook Time: {cookTime}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
