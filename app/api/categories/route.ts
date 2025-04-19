import { NextResponse } from "next/server";
import { Pool } from 'pg';

// Create a new pool using the database URL
// @ts-expect-error - Using environment variable that might be undefined at build time
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    // Execute query to get all categories
    const result = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    return NextResponse.json({ categories: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return NextResponse.json(
      { error: 'Error fetching categories', details: (err as Error).message },
      { status: 500 }
    );
  }
}
