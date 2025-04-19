import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../../auth/[...nextauth]/route';

// PATCH: Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, role, password } = body;

    // Build the update query dynamically
    const updateFields = [];
    const updateValues: any[] = [];
    
    if (name) {
      updateFields.push('name = $1');
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push(`email = $${updateValues.length + 1}`);
      updateValues.push(email);
    }
    
    if (role) {
      // Validate role
      if (!Object.values(UserRole).includes(role as UserRole)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateFields.push(`role = $${updateValues.length + 1}`);
      updateValues.push(role);
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${updateValues.length + 1}`);
      updateValues.push(hashedPassword);
    }
    
    // Add updated_at
    updateFields.push(`updated_at = $${updateValues.length + 1}`);
    updateValues.push(new Date());
    
    // Add userId
    updateValues.push(userId);
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Execute the update
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${updateValues.length}
      RETURNING id, name, email, role, created_at, updated_at
    `;
    
    const { rows } = await sql.query(query, updateValues);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: rows[0]
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete the user
    const { rowCount } = await sql`
      DELETE FROM users WHERE id = ${userId}
    `;
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Get a single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get the user
    const { rows } = await sql`
      SELECT id, name, email, role, created_at, updated_at
      FROM users WHERE id = ${userId}
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      user: rows[0]
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}
