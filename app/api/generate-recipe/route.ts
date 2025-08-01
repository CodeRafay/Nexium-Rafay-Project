import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCollection } from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
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
            console.log('Session error:', sessionError);
            return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
        }

        const user = session.user;
        if (!user) {
            console.log('No user in session');
            return NextResponse.json({ error: 'Unauthorized - No user' }, { status: 401 });
        }

        const userId = user.id;
        console.log('Authenticated user:', userId);

        // 2. Parse JSON body
        const body = await req.json();
        const { ingredients } = body;
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ error: 'Invalid ingredients' }, { status: 400 });
        }

        // 3. Send to n8n webhook
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl) {
            return NextResponse.json({ error: 'N8N webhook not configured' }, { status: 500 });
        }

        let recipe;
        try {
            console.log('Calling n8n webhook with ingredients:', ingredients);
            const n8nRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            });

            if (!n8nRes.ok) {
                const errorText = await n8nRes.text();
                console.error('n8n webhook failed:', errorText);
                throw new Error('n8n webhook failed');
            }

            recipe = await n8nRes.json();
            console.log('Received recipe from n8n:', recipe);
        } catch (err) {
            console.error('n8n error:', err);
            return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 502 });
        }

        // 4. Save recipe in MongoDB
        let mongoId;
        try {
            const recipesCol = await getCollection('recipes');
            const mongoRes = await recipesCol.insertOne({ ...recipe, userId, createdAt: new Date() });
            mongoId = mongoRes.insertedId.toString();
            console.log('Saved to MongoDB with ID:', mongoId);
        } catch (err) {
            console.error('MongoDB error:', err);
            return NextResponse.json({ error: 'Failed to save recipe in MongoDB' }, { status: 500 });
        }

        // 5. Insert userId + mongo_recipe_id into Supabase
        try {
            const { error: insertError } = await supabase.from('saved_recipes').insert({
                user_id: userId,
                mongo_recipe_id: mongoId,
                title: recipe.title,
            });
            if (insertError) throw insertError;
            console.log('Saved to Supabase');
        } catch (err) {
            console.error('Supabase error:', err);
            return NextResponse.json({ error: 'Failed to save recipe in Supabase' }, { status: 500 });
        }

        // 6. Return the full recipe
        return NextResponse.json({ ...recipe, id: mongoId });
    } catch (err) {
        console.error('General error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
