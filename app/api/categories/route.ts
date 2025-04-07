import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await sql`SELECT name FROM categories ORDER BY name ASC`;
    const categories = result.rows.map(row => row.name);
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: (error as Error).message },
      { status: 500 }
    );
  }
}