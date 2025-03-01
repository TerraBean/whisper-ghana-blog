// app/api/posts/[id]/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';



// Define route segment config to allow dynamic route
export const dynamic = 'force-dynamic';

// Type definition for route parameters
interface Params {
  id: string; // 'id' should match the dynamic segment name: '[id]'
}

export async function GET(request: Request, { params }: { params: Params }) {
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
const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  content: z.any().optional(),
  status: z.enum(['draft', 'published']).optional(),
  scheduled_publish_at: z.string().optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id; // Remove await here

  try {
    // Validate request body
    const requestBody = await request.json();
    const validatedData = updatePostSchema.parse(requestBody);

    // Destructure validated data
    const { title, description, category, tags, content, status, scheduled_publish_at } = validatedData;

    // Convert tags to array format
    const tagsArray = tags?.split(',').map(tag => tag.trim()) || [];

    // Handle published_at logic
    let publishedAt = null;
    if (status === 'published' && !scheduled_publish_at) { // Publish immediately if status is 'published' and no scheduled date
      publishedAt = new Date().toISOString();
    }

    // Build the update query
    const result = await sql`
            UPDATE posts
            SET
                title = ${title},
                description = ${description},
                category = ${category},
                tags = ${tagsArray},
                content = ${JSON.stringify(content)},
                status = ${status},
                published_at = ${publishedAt},
                scheduled_publish_at = ${scheduled_publish_at}
            WHERE id = ${postId}
            RETURNING *;
        `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Post updated successfully', post: result.rows[0] },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error updating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
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