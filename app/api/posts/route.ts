// app/api/posts/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic'; // Ensure dynamic responses

export async function GET(request: Request) {
  try {
    // --- 1. Database Query: Fetch all posts ---
    const result = await sql`SELECT * FROM posts ORDER BY created_at DESC;`; // Fetch all posts, newest first
    const posts = result.rows;

    // --- 2. Success Response ---
    return NextResponse.json({ posts }, { status: 200 }); // 200 OK - Return posts data

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts from database.' }, { status: 500 }); // 500 Internal Server Error
  }
}