import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'), // Category is now required
  tags: z.string().optional(),
  content: z.any(),
  status: z.enum(['draft', 'published']),
  scheduled_publish_at: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validatedData = createPostSchema.parse(requestBody);
    const { title, description, category, tags, content, status, scheduled_publish_at } = validatedData;

    // Look up category_id based on category name
    const categoryResult = await sql`SELECT id FROM categories WHERE name = ${category}`;
    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { error: `Category '${category}' does not exist` },
        { status: 400 }
      );
    }
    const categoryId = categoryResult.rows[0].id;

    // Handle tags (split into array, keep as is for now)
    const tagsArray = tags?.split(',').map(tag => tag.trim()) || [];
    const tagsArrayLiteral = tagsArray.length > 0 ? `{${tagsArray.map(tag => `"${tag}"`).join(',')}}` : null;

    // Handle published_at logic
    let publishedAt = null;
    if (status === 'published' && !scheduled_publish_at) {
      publishedAt = new Date().toISOString();
    }

    // Insert post with category_id instead of category name
    const result = await sql`
      INSERT INTO posts (
        title, description, category_id, tags, author, content, status, published_at, scheduled_publish_at
      ) VALUES (
        ${title}, ${description}, ${categoryId}, ${tagsArrayLiteral}, 'admin', ${JSON.stringify(content)}, ${status},
        ${publishedAt}, ${scheduled_publish_at}
      ) RETURNING *
    `;

    return NextResponse.json({ message: "Post created successfully", post: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating post:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}