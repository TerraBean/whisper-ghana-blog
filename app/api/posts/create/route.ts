// app/api/posts/create/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export async function POST(request: Request) {
  try {
    // --- 1. Parse Request Body ---
    const requestBody = await request.json(); // Parse JSON body
    const { title, description, category, tags, content } = requestBody;

    // --- 2. Input Validation (Basic) ---
    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 }); // 400 Bad Request
    }
    if (!content) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 }); // 400 Bad Request
    }

    // --- 3. Generate Post ID (UUID) ---
    const postId = uuidv4(); // Generate a unique ID for the post

    // --- 4. Database Insertion ---
    let tagsArray: string[] | null = null;
    if(tags){
        tagsArray = tags.split(',').map((tag:string) => tag.trim())
    }
    await sql`
      INSERT INTO posts (id, title, description, category, tags, content, created_at)
      VALUES (${postId}, ${title || null}, ${description || null}, ${category || null}, ${tagsArray}, ${JSON.stringify(content)}, NOW());
    `; // content is already JSON, stringify for safety


    // --- 5. Success Response ---
    return NextResponse.json({ message: 'Post created successfully!', postId: postId }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post in database.' }, { status: 500 }); // 500 Internal Server Error
  }
}