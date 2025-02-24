// app/api/posts/[id]/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';



// Define route segment config to allow dynamic route
export const dynamic = 'force-dynamic';

// Type definition for route parameters
interface Params {
  params: {
    id: string; // 'id' should match the dynamic segment name: '[id]'
  };
}

export async function GET(request: Request, { params }: Params) {
  // --- 1. Destructure params and get postId ---
  const { id: postId } = await params; // Destructure 'id' as 'postId'

  // --- 2. Input Validation ---
  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });
  }

  try {
    // --- 3. Database Query ---
    const postResult = await sql`
      SELECT
        id,
        title,
        description,
        category,
        tags,
        author,
        content,
        minutes_to_read,
        created_at,
        published_at
      FROM posts
      WHERE id = ${postId};
    `;

    // --- 4. Post Not Found Check ---
    if (postResult.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    // --- 5. Data Formatting ---
    const row = postResult.rows[0];
    const post = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags,
      author: row.author,
      content: row.content,
      minutesToRead: row.minutes_to_read,
      createdAt: row.created_at?.toISOString(),
      publishedAt: row.published_at?.toISOString(),
    };

    // --- 6. Return JSON Response ---
    return NextResponse.json({ post }, { status: 200 });

  } catch (error) {
    console.error('Error fetching post by ID:', postId, error);
    return NextResponse.json({ error: 'Error fetching post from database.' }, { status: 500 });
  }
}


// --- PUT request handler (for updating a post) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // Destructure params
) {
  const postId = await params.id; // Get post ID from route params

  try {
    // --- 1. Parse Request Body ---
    const requestBody = await request.json();
    const { title, description, category, tags, content } = requestBody;

    // --- 2. Input Validation (Basic - extend as needed) ---
    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 }); // 400 Bad Request
    }
    if (!content) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 }); // 400 Bad Request
    }

    // --- 3. Process Tags (Split comma-separated string into array) ---
    let tagsArrayLiteral: string | null = null;
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim());
      tagsArrayLiteral = `{${tagsArray.join(',')}}`;
    }


    // --- 4. Database Update ---
    const result = await sql`
      UPDATE posts
      SET title = ${title || null},
          description = ${description || null},
          category = ${category || null},
          tags = ${tagsArrayLiteral},
          content = ${JSON.stringify(content)},
          updated_at = NOW()
      WHERE id = ${postId}
      RETURNING id; -- Return the ID of the updated post
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Post not found for update.' }, { status: 404 }); // 404 Not Found if no rows updated
    }

    // --- 5. Success Response ---
    return NextResponse.json({ message: 'Post updated successfully!', postId: postId }, { status: 200 }); // 200 OK - Update successful

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post in database.' }, { status: 500 }); // 500 Internal Server Error
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } } // Destructure params
) {
  const postId = params.id; // Get post ID from route params

  try {
    // --- 1. Database Delete Operation ---
    const result = await sql`
      DELETE FROM posts
      WHERE id = ${postId}
      RETURNING id; -- Optionally return the ID of the deleted post
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Post not found for deletion.' }, { status: 404 }); // 404 Not Found if no rows deleted
    }

    // --- 2. Success Response ---
    return NextResponse.json({ message: 'Post deleted successfully!', postId: postId }, { status: 200 }); // 200 OK - Deletion successful

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post from database.' }, { status: 500 }); // 500 Internal Server Error
  }
}