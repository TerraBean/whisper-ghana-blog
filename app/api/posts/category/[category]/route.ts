import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  try {
    // Main query to fetch posts with related data
    const query = `
      SELECT
        p.id,
        p.title,
        p.description,
        c.name AS category,
        COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags,
        a.name AS author,
        p.content,
        p.minutes_to_read,
        p.created_at,
        p.published_at,
        p.status
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.status = 'published'
      AND p.published_at IS NOT NULL
      AND c.name = $1
      GROUP BY p.id, p.title, p.description, c.name, a.name, p.content, p.minutes_to_read, p.created_at, p.published_at, p.status
      ORDER BY p.published_at DESC
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

    // Query to get the total count for pagination
    const countQuery = `
      SELECT COUNT(*)
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
      AND p.published_at IS NOT NULL
      AND c.name = $1
    `;
    const countResult = await sql.query(countQuery, [category]);
    const total = parseInt(countResult.rows[0].count, 10);

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}