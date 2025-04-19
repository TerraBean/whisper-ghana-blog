import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// @ts-ignore
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to query the existing categories
    try {
      await sql`SELECT id FROM categories LIMIT 1`;
    } catch (error) {
      // If the table doesn't exist, create it
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Insert some sample categories
      await sql`
        INSERT INTO categories (id, name, description)
        VALUES 
          ('cat1', 'News', 'Latest news and updates'),
          ('cat2', 'Sports', 'Sports coverage and highlights'),
          ('cat3', 'Technology', 'Technology news and reviews'),
          ('cat4', 'Entertainment', 'Entertainment and celebrity news'),
          ('cat5', 'Politics', 'Political news and analysis')
        ON CONFLICT (name) DO NOTHING
      `;
    }

    // Get post counts per category
    const categoriesWithCount = await sql`
      WITH post_counts AS (
        SELECT 
          category_id, 
          COUNT(*) as count 
        FROM posts 
        WHERE category_id IS NOT NULL 
        GROUP BY category_id
      )
      SELECT 
        c.id, 
        c.name, 
        c.description, 
        COALESCE(pc.count, 0) as count, 
        c.created_at
      FROM categories c
      LEFT JOIN post_counts pc ON c.id = pc.category_id
      ORDER BY c.name ASC
    `;

    const categoriesData = categoriesWithCount.rows.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      description: category.description,
      count: parseInt(category.count) || 0,
      created_at: category.created_at
    }));

    return NextResponse.json({
      categories: categoriesData
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
