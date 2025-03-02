// app/api/posts/create/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  content: z.any(), // Assuming 'any' type for editor content
  status: z.enum(['draft', 'published']),
  scheduled_publish_at: z.string().optional().nullable(), // <-- Add scheduled_publish_at, optional and nullable string
});



export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedData = createPostSchema.parse(requestBody);
    const { title, description, category, tags, content, status, scheduled_publish_at } = validatedData;


    const tagsArray = tags?.split(',').map(tag => tag.trim()) || [];
    const tagsArrayLiteral = tagsArray.length > 0 ? `{${tagsArray.map(tag => `"${tag}"`).join(',')}}` : null;

    let publishedAt = null;
    if (status === 'published' && !scheduled_publish_at) { // Publish immediately if status is 'published' and no scheduled date
      publishedAt = new Date().toISOString();
    }


    const result = await sql`
    INSERT INTO posts (
        title, description, category, tags, author, content, status, published_at, scheduled_publish_at
    ) VALUES (
        ${title}, ${description}, ${category}, ${tagsArrayLiteral}, 'admin', ${JSON.stringify(content)}, ${status},
        ${publishedAt}, ${scheduled_publish_at}  
    )
    RETURNING *;
`;

    return NextResponse.json({ message: "Post created successfully", post: result.rows[0] }, { status: 201 });

  } catch (error: unknown) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}