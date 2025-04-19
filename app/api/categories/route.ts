import { NextResponse } from "next/server";
import { Pool } from 'pg';

// Create a new pool using the database URL
// @ts-expect-error - Using environment variable that might be undefined at build time
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    // Execute query to get all categories with post counts
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        COUNT(p.id) FILTER (WHERE p.status = 'published' AND p.published_at IS NOT NULL) as count
      FROM 
        categories c
      LEFT JOIN 
        posts p ON c.id = p.category_id
      GROUP BY 
        c.id, c.name
      ORDER BY 
        c.name ASC
    `);
    
    return NextResponse.json({ categories: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return NextResponse.json(
      { error: 'Error fetching categories', details: (err as Error).message },
      { status: 500 }
    );
  }
}
