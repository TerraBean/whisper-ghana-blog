// app/api/posts/recent/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '6', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10); // Extract offset
  const isFeatured = searchParams.get('isFeatured') === 'true';

  try {
    let query = `
      SELECT
        id,
        title,
        description,
        category,
        tags,
        author,
        content,
        minutes_to_read,
        created_at,
        published_at,
        status,
        is_featured
      FROM posts
      WHERE status = 'published'
      AND published_at IS NOT NULL
    `;

    if (isFeatured) {
      query += ` AND is_featured = TRUE`;
    }

    query += ` ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}`; // Add OFFSET

    const postsResult = await sql.query(query);
    const posts = postsResult.rows.map(row => ({
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
      isFeatured: row.is_featured,
    }));

    const countQuery = `
      SELECT COUNT(*)
      FROM posts
      WHERE status = 'published'
      AND published_at IS NOT NULL
    `;
    const countResult = await sql.query(countQuery);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts from database' }, { status: 500 });
  }
}