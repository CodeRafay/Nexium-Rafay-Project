import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
    // TODO: Implement fetch saved recipes
    return NextResponse.json({ recipes: [] });
}

export async function POST(_req: NextRequest) {
    // TODO: Implement save recipe
    return NextResponse.json({ success: true });
}
