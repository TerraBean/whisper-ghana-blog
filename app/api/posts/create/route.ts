// app/api/posts/create/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  content: z.any(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedData = postSchema.parse(requestBody);
    const { title, description, category, tags, content, status } = validatedData;

    // Convert tags string to array format for PostgreSQL
    const tagsArray = tags?.split(',').map(tag => tag.trim()) || [];
    const tagsArrayLiteral = tagsArray.length > 0 ? tagsArray : null;

    // Handle published_at logic
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    const result = await sql`
      INSERT INTO posts (
        title, 
        description, 
        category, 
        tags, 
        content, 
        status, 
        published_at
      )
      VALUES (
        ${title},
        ${description},
        ${category},
        ${tagsArrayLiteral},
        ${JSON.stringify(content)},
        ${status},
        ${publishedAt}
      )
      RETURNING id;
    `;

    if (result.rows[0]?.id) {
      return NextResponse.json(
        { message: 'Post created successfully', postId: result.rows[0].id },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}