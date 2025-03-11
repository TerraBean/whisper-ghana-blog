// utils/api.ts
import { PostCardProps } from '@/app/types' // Import PostCardProps from types.ts

export async function getRecentPosts(limit: number = 6): Promise<{ posts: PostCardProps[], total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/posts/recent`);
    url.searchParams.append('status', 'published');
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    if (!data?.posts || !Array.isArray(data.posts) || typeof data.total !== 'number') {
      throw new Error('Invalid response format');
    }

    return { posts: data.posts as PostCardProps[], total: data.total };
  } catch (error) {
    console.error('Critical error in getRecentPosts:', error);
    return { posts: [], total: 0 };
  }
}