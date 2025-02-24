// app/api/posts/recent/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // --- Database Query to Fetch Recent Posts ---
    const recentPosts = await sql`
      SELECT
        id,
        title,
        description,
        category,
        minutes_to_read,
        created_at
      FROM posts
      ORDER BY created_at DESC  -- Order by creation date, newest first
      LIMIT 6;                 -- Limit to 6 recent posts
    `;

    // --- Format the Data for Response ---
    const posts = recentPosts.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      minutesToRead: row.minutes_to_read,
      createdAt: row.created_at.toISOString(), // Format date to ISO string for JSON
    }));

    // --- Return JSON Response with Recent Posts ---
    return NextResponse.json({ posts }, { status: 200 }); // 200 OK status

  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json({ error: 'Error fetching recent posts from database.' }, { status: 500 }); // 500 Internal Server Error
  }
}