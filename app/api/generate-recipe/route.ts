import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCollection } from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user
        const supabase = createRouteHandlerClient({ cookies });
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user.id;

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
            const n8nRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            });
            if (!n8nRes.ok) throw new Error('n8n webhook failed');
            recipe = await n8nRes.json();
        } catch (err) {
            return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 502 });
        }

        // 4. Save recipe in MongoDB
        let mongoId;
        try {
            const recipesCol = await getCollection('recipes');
            const mongoRes = await recipesCol.insertOne({ ...recipe, userId, createdAt: new Date() });
            mongoId = mongoRes.insertedId.toString();
        } catch (err) {
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
        } catch (err) {
            return NextResponse.json({ error: 'Failed to save recipe in Supabase' }, { status: 500 });
        }

        // 6. Return the full recipe
        return NextResponse.json({ ...recipe, id: mongoId });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
