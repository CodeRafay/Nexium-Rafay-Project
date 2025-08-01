import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCollection } from '../../../lib/mongodb';

export async function GET() {
    try {
        // 1. Authenticate user using modern Supabase SSR
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        // Get session first, then user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
        }

        const user = session.user;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized - No user' }, { status: 401 });
        }

        const userId = user.id;

        // 2. Get saved recipes from Supabase
        const { data: savedRecipes, error: supabaseError } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('user_id', userId);

        if (supabaseError) {
            return NextResponse.json({ error: 'Failed to fetch saved recipes' }, { status: 500 });
        }

        // 3. Get full recipe details from MongoDB
        const recipesCol = await getCollection('recipes');
        const fullRecipes = [];

        for (const savedRecipe of savedRecipes || []) {
            try {
                const mongoRecipe = await recipesCol.findOne({ _id: savedRecipe.mongo_recipe_id });
                if (mongoRecipe) {
                    fullRecipes.push({
                        id: savedRecipe.id,
                        title: mongoRecipe.title,
                        ingredients: mongoRecipe.ingredients,
                        instructions: mongoRecipe.instructions,
                        prepTime: mongoRecipe.prepTime,
                        cookTime: mongoRecipe.cookTime,
                        createdAt: savedRecipe.created_at,
                    });
                }
            } catch {
                console.error('Error fetching recipe from MongoDB');
            }
        }

        return NextResponse.json({ recipes: fullRecipes });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST() {
    // TODO: Implement save recipe
    return NextResponse.json({ success: true });
}
