import { PostCardProps } from '@/app/types';

// Existing getRecentPosts function (unchanged)
export async function getRecentPosts(limit: number = 6, isFeatured: boolean = false): Promise<{ posts: PostCardProps[], total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/posts/recent`);
    url.searchParams.append('limit', limit.toString());
    if (isFeatured) {
      url.searchParams.append('isFeatured', 'true');
    }

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

// New function to fetch posts by category
export async function getPostsByCategory(
  category: string,
  limit: number = 6,
  offset: number = 0
): Promise<{ posts: PostCardProps[], total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/posts/category/${category}`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

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
    console.error('Critical error in getPostsByCategory:', error);
    return { posts: [], total: 0 };
  }
}