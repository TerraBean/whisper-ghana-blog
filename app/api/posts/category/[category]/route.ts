import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request, { params }: { params: { category: string } }) {
  const { category } = params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  try {
    const query = `
      SELECT id, title, description, category, tags, author, content, minutes_to_read, created_at, published_at, status
      FROM posts
      WHERE status = 'published' AND published_at IS NOT NULL AND category = $1
      ORDER BY published_at DESC
      LIMIT $2 OFFSET $3
    `;
    const postsResult = await sql.query(query, [category, limit, offset]);
    const posts = postsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags,
      author: row.author,
      content: row.content,
      minutesToRead: row.minutes_to_read,
      createdAt: row.created_at?.toISOString(),
      published_at: row.published_at?.toISOString(),
      status: row.status,
    }));

    const countQuery = `
      SELECT COUNT(*)
      FROM posts
      WHERE status = 'published' AND published_at IS NOT NULL AND category = $1
    `;
    const countResult = await sql.query(countQuery, [category]);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}