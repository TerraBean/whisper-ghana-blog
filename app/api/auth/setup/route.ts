import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // First, drop the table if it exists and recreate it
    try {
      // Drop existing table to start fresh
      await sql`DROP TABLE IF EXISTS users`;
      
      // Create users table with proper schema
      await sql`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          role TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Recreated users table');
    } catch (err) {
      console.error('Error recreating table:', err);
      return NextResponse.json({ error: 'Failed to recreate table' }, { status: 500 });
    }

    // Create the test users
    try {
      // Hash password
      const password = await bcrypt.hash('password123', 10);
      
      // Create admin user
      await sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${uuidv4()}, 'Admin User', 'admin@example.com', ${password}, 'admin')
      `;
      
      // Create editor user
      await sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${uuidv4()}, 'Editor User', 'editor@example.com', ${password}, 'editor')
      `;

      // Create regular user
      await sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${uuidv4()}, 'Regular User', 'user@example.com', ${password}, 'user')
      `;
      
      console.log('Created test users');
      
      // Return all users
      const { rows: users } = await sql`
        SELECT id, name, email, role, created_at FROM users
      `;
      
      return NextResponse.json({
        message: 'Auth setup completed successfully',
        users: users
      });
    } catch (err) {
      console.error('Error creating users:', err);
      return NextResponse.json({ error: 'Failed to create users', details: (err as Error).message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in setup:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
