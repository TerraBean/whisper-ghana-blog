// app/api/posts/route.ts

import { NextResponse } from "next/server";
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

// Create a new pool using the database URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    // Build the query parts separately for better control
    let queryParts = [];
    let parameters = [];
    let paramIndex = 1;
    
    const selectStatement = `
      SELECT 
        p.id, 
        p.title, 
        p.description,
        p.content,
        p.minutes_to_read,
        p.created_at,
        p.updated_at,
        p.published_at,
        p.status,
        p.scheduled_publish_at,
        p.is_featured,
        p.author_id,
        p.category_id,
        c.name as category,
        a.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id`;
    
    // Where clause conditions
    let conditions = [];
    
    if (category) {
      conditions.push(`c.name = $${paramIndex}`);
      parameters.push(category);
      paramIndex++;
    }
    
    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      parameters.push(`%${search}%`);
      paramIndex++;
    }

    if (status && status !== 'all') {
      conditions.push(`p.status = $${paramIndex}`);
      parameters.push(status);
      paramIndex++;
    }
    
    // Complete query
    let fullQuery = selectStatement;
    if (conditions.length > 0) {
      fullQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    fullQuery += ` ORDER BY p.created_at DESC`;
    
    // Execute the query
    const result = await pool.query(fullQuery, parameters);
    
    const posts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      minutes_to_read: row.minutes_to_read,
      created_at: row.created_at,
      updated_at: row.updated_at,
      published_at: row.published_at,
      status: row.status,
      scheduled_publish_at: row.scheduled_publish_at,
      is_featured: row.is_featured,
      author_id: row.author_id,
      category_id: row.category_id,
      category: row.category,
      author: row.author_name, // Adding author property to match expected frontend property
      author_name: row.author_name // Keep original property too
    }));

    // Return posts array in an object with total count
    return NextResponse.json({ 
      posts,
      total: posts.length 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// ... (rest of the route.ts file - PUT, DELETE, POST handlers - unchanged) ...