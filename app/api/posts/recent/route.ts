// app/api/posts/recent/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
//   const statusFilter = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  try {
    const postsQuery = sql`
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
        status
      FROM posts
      WHERE status = 'published'
      AND published_at IS NOT NULL
      ORDER BY published_at DESC
      LIMIT ${limit}
    `;

    const countQuery = sql`
      SELECT COUNT(*)
      FROM posts
      WHERE status = 'published'
      AND published_at IS NOT NULL
    `;

    const [postsResult, countResult] = await Promise.all([postsQuery, countQuery]);

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
    }));

    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json({ error: 'Error fetching recent posts from database' }, { status: 500 });
  }
}