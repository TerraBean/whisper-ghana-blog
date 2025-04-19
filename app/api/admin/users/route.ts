import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    // The middleware.ts file should handle basic auth protection
    // This endpoint is restricted to admin users via the matcher configuration
    
    // Get all users
    const { rows } = await sql`
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ users: rows });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // The middleware.ts file should handle basic auth protection
    // This endpoint is restricted to admin users via the matcher configuration
    
    // Parse request body
    const body = await request.json();
    const { name, email, password, role } = body;
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required fields' },
        { status: 400 }
      );
    }
    
    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Check if email is already in use
    const { rows: existingUsers } = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate user ID
    const userId = uuidv4();
    
    // Insert user into database
    const { rows } = await sql`
      INSERT INTO users (id, name, email, password, role, created_at, updated_at)
      VALUES (
        ${userId},
        ${name},
        ${email},
        ${hashedPassword},
        ${role || UserRole.USER},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING id, name, email, role, created_at, updated_at
    `;
    
    return NextResponse.json(
      { message: 'User created successfully', user: rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
