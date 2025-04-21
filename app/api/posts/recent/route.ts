// app/api/posts/recent/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Check if we're just requesting stats
  const requestingStats = searchParams.get('stats') === 'true';
  
  // If stats are requested, we'll fetch different data
  if (requestingStats) {
    try {
      // Query to get post counts by status
      const statsQuery = `
        SELECT 
          COUNT(*) as total_count,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
          SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_count
        FROM posts
      `;
      
      const statsResult = await sql.query(statsQuery);
      const stats = statsResult.rows[0];
      
      return NextResponse.json({
        totalCount: parseInt(stats.total_count || '0', 10),
        publishedCount: parseInt(stats.published_count || '0', 10),
        draftCount: parseInt(stats.draft_count || '0', 10),
        scheduledCount: parseInt(stats.scheduled_count || '0', 10)
      }, { status: 200 });
    } catch (error) {
      console.error('Error fetching post statistics:', error);
      return NextResponse.json({ error: 'Error fetching post statistics from database' }, { status: 500 });
    }
  }
  
  // Regular post fetching logic below for non-stats requests
  // Parse and validate limit and offset parameters
  let limit = parseInt(searchParams.get('limit') || '6', 10);
  let offset = parseInt(searchParams.get('offset') || '0', 10);
  
  // Ensure limit and offset are valid numbers
  if (isNaN(limit) || limit <= 0) limit = 6;
  if (isNaN(offset) || offset < 0) offset = 0;
  
  const isFeatured = searchParams.get('isFeatured') === 'true';

  try {
    console.log(`Fetching posts with limit: ${limit}, offset: ${offset}, featured: ${isFeatured}`);
    
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

    console.log(`Returning ${posts.length} posts out of total ${total}`);
    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts from database' }, { status: 500 });
  }
}