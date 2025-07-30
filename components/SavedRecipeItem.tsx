import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SavedRecipeItem({ title, onDelete }: { title: string; onDelete: () => void }) {
    return (
        <Card className="mb-2">
            <CardContent className="flex items-center justify-between p-4">
                <span>{title}</span>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
            </CardContent>
        </Card>
    );
}
