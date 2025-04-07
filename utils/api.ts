import { PostCardProps } from '@/app/types';

// Fixed getRecentPosts function with proper parameter validation
export async function getRecentPosts(
  limit: number = 6,
  offset: number = 0,
  isFeatured: boolean = false
): Promise<{ posts: PostCardProps[], total: number }> {
  try {
    // Validate inputs to ensure we're passing valid numbers
    if (isNaN(limit) || limit <= 0) limit = 6;
    if (isNaN(offset) || offset < 0) offset = 0;
    
    console.log(`Fetching recent posts with limit=${limit}, offset=${offset}, featured=${isFeatured}`);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/posts/recent`);
    
    // Ensure parameters are properly stringified
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));
    if (isFeatured) {
      url.searchParams.append('isFeatured', 'true');
    }

    console.log('Request URL:', url.toString());
    
    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Disable caching to ensure fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log(`Received ${data?.posts?.length || 0} posts from API`);

    if (!data?.posts || !Array.isArray(data.posts)) {
      throw new Error('Invalid response format: posts array missing');
    }

    return { 
      posts: data.posts as PostCardProps[], 
      total: typeof data.total === 'number' ? data.total : 0 
    };
  } catch (error) {
    console.error('Critical error in getRecentPost:', error);
    return { posts: [], total: 0 };
  }
}

// Ensure getPostsByCategory has the same validation
export async function getPostsByCategory(
  category: string,
  limit: number = 6,
  offset: number = 0
): Promise<{ posts: PostCardProps[], total: number }> {
  try {
    // Validate inputs
    if (isNaN(limit) || limit <= 0) limit = 6;
    if (isNaN(offset) || offset < 0) offset = 0;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`${baseUrl}/api/posts/category/${encodeURIComponent(category)}`);
    
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    if (!data?.posts || !Array.isArray(data.posts)) {
      throw new Error('Invalid response format');
    }

    return { 
      posts: data.posts as PostCardProps[], 
      total: typeof data.total === 'number' ? data.total : 0 
    };
  } catch (error) {
    console.error('Critical error in getPostsByCategory:', error);
    return { posts: [], total: 0 };
  }
}