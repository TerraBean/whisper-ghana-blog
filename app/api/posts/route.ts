// app/api/posts/route.ts

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Start with a base query
    let query = sql`SELECT id, title, slug, content, created_at, updated_at, category, featured_image`;
    
    // Note: We're explicitly selecting columns instead of using * to avoid missing column errors
    
    // Add WHERE clause conditionally
    if (category || search) {
      query = sql`${query} FROM posts WHERE`;
      
      if (category) {
        query = sql`${query} category = ${category}`;
        if (search) {
          query = sql`${query} AND`;
        }
      }
      
      if (search) {
        query = sql`${query} (title ILIKE ${`%${search}%`} OR content ILIKE ${`%${search}%`})`;
      }
    } else {
      query = sql`${query} FROM posts`;
    }
    
    // Order by created_at
    query = sql`${query} ORDER BY created_at DESC`;
    
    const results = await query; // Execute the constructed query
    const posts = results.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category,
      featured_image: row.featured_image,
      // Don't try to access tags if the column doesn't exist
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

// ... (rest of the route.ts file - PUT, DELETE, POST handlers - unchanged) ...