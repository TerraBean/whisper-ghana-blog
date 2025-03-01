// app/api/publish-scheduled-posts/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';


export async function GET() { // Or POST if you prefer - GET is simpler for manual trigger
    try {
        const now = new Date();
        const scheduledPosts = await sql`
            SELECT id
            FROM posts
            WHERE
                status = 'published'
                AND scheduled_publish_at <= ${now.toISOString()}
                AND published_at IS NULL
        `;

        if (scheduledPosts.rows.length === 0) {
            return NextResponse.json({ message: "No posts to publish at this time." }, { status: 200 });
        }


        const postIdsToPublish = scheduledPosts.rows.map(row => row.id);

        // Update published_at for each scheduled post
        for (const postId of postIdsToPublish) {
            await sql`
                UPDATE posts
                SET published_at = ${now.toISOString()}
                WHERE id = ${postId}
            `;
        }


        return NextResponse.json({
            message: `Successfully published ${scheduledPosts.rows.length} scheduled posts.`,
            publishedPostIds: postIdsToPublish
        }, { status: 200 });


    } catch (error) {
        console.error("Error publishing scheduled posts:", error);
        return NextResponse.json({ error: "Error publishing scheduled posts." }, { status: 500 });
    }
}