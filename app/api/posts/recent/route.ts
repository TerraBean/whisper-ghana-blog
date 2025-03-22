import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '6', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const isFeatured = searchParams.get('isFeatured') === 'true';

  try {
    const postsQuery = `
      SELECT
        p.id,
        p.title,
        p.description,
        c.name AS category,
        COALESCE(array_agg(t.name), '{}') AS tags,
        a.name AS author,
        p.content,
        p.minutes_to_read,
        p.created_at,
        p.updated_at,
        p.published_at,
        p.status,
        p.is_featured
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.status = 'published'
      AND p.published_at IS NOT NULL
      ${isFeatured ? 'AND p.is_featured = TRUE' : ''}
      GROUP BY p.id, p.title, p.description, c.name, a.name, p.content, p.minutes_to_read, p.created_at, p.updated_at, p.published_at, p.status, p.is_featured
      ORDER BY p.published_at DESC
      LIMIT $1 OFFSET $2
    `;

    const postsResult = await sql.query(postsQuery, [limit, offset]);
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
      ${isFeatured ? 'AND is_featured = TRUE' : ''}
    `;
    const countResult = await sql.query(countQuery);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts from database' }, { status: 500 });
  }
}