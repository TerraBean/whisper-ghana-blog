// app/api/posts/recent/route.ts  (Example - adjust filename if your route is different)

import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) { // Use NextRequest
    const searchParams = request.nextUrl.searchParams;
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
                status
            FROM posts
        `;

        if (statusFilter === 'published') { // Apply filter ONLY for 'published' status on frontend
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
                WHERE status = 'published'
            `;
        } // If no statusFilter or statusFilter is not 'published', fetch all (or adjust as needed for your logic)


        const results = await query;
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
            status: row.status
        }));


        return NextResponse.json({ posts }, { status: 200 });

    } catch (error) {
        console.error("Error fetching recent posts:", error);
        return NextResponse.json({ error: "Error fetching recent posts from database" }, { status: 500 });
    }
}