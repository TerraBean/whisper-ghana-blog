import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const query = `
      SELECT DISTINCT category
      FROM posts
      WHERE status = 'published' AND published_at IS NOT NULL AND category IS NOT NULL
      ORDER BY category ASC
    `;
    const result = await sql.query(query);
    const categories = result.rows.map((row) => row.category);
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}