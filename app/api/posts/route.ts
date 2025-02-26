// app/api/posts/route.ts

import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) { // Use NextRequest type
    const searchParams = request.nextUrl.searchParams; // Get search params
    const statusFilter = searchParams.get('status'); // Get 'status' query parameter

    try {
        let query = sql`
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
                published_at,
                status  -- Include status in SELECT
            FROM posts
        `;

        if (statusFilter && statusFilter !== 'all') { // Apply status filter if provided and not 'all'
            query = sql`
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
                    published_at,
                    status
                FROM posts
                WHERE status = ${statusFilter}
            `;
        }


        const results = await query; // Execute the constructed query
        const posts = results.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            tags: row.tags,
            author: row.author,
            content: row.content,
            minutesToRead: row.minutes_to_read,
            createdAt: row.created_at?.toISOString(),
            published_at: row.published_at?.toISOString(),
            status: row.status // Include status in response
        }));


        return NextResponse.json({ posts }, { status: 200 });

    } catch (error) {
        console.error("Error fetching posts with filter:", error);
        return NextResponse.json({ error: "Error fetching posts from database" }, { status: 500 });
    }
}


// ... (rest of the route.ts file - PUT, DELETE, POST handlers - unchanged) ...