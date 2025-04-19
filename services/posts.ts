import { CreatePostRequest, Post, PostsResponse, UpdatePostRequest } from '@/types';

// Base URL for all API requests
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Get recent posts with optional filters
 */
export async function getRecentPosts(
  limit: number = 6,
  offset: number = 0,
  isFeatured: boolean = false
): Promise<PostsResponse> {
  try {
    // Validate inputs
    if (isNaN(limit) || limit <= 0) limit = 6;
    if (isNaN(offset) || offset < 0) offset = 0;
    
    const url = new URL(`${BASE_URL}/api/posts/recent`);
    
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));
    if (isFeatured) {
      url.searchParams.append('isFeatured', 'true');
    }
    
    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    return { 
      posts: data.posts as Post[], 
      total: typeof data.total === 'number' ? data.total : 0 
    };
  } catch (error) {
    console.error('Error in getRecentPosts:', error);
    return { posts: [], total: 0 };
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  category: string,
  limit: number = 6,
  offset: number = 0
): Promise<PostsResponse> {
  try {
    // Validate inputs
    if (isNaN(limit) || limit <= 0) limit = 6;
    if (isNaN(offset) || offset < 0) offset = 0;
    
    const url = new URL(`${BASE_URL}/api/posts/category/${encodeURIComponent(category)}`);
    
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('offset', String(offset));

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return { 
      posts: data.posts as Post[], 
      total: typeof data.total === 'number' ? data.total : 0 
    };
  } catch (error) {
    console.error('Error in getPostsByCategory:', error);
    return { posts: [], total: 0 };
  }
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.post as Post;
  } catch (error) {
    console.error('Error in getPostById:', error);
    return null;
  }
}

/**
 * Create a new post
 */
export async function createPost(postData: CreatePostRequest): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || `Failed with status: ${response.status}`
      };
    }

    return { success: true, post: data.post as Post };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, postData: UpdatePostRequest): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || `Failed with status: ${response.status}`
      };
    }

    return { success: true, post: data.post as Post };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || `Failed with status: ${response.status}`
      };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Get all available categories
 */
export async function getCategories(): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/categories`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Categories fetched in service:', data); // Debug log
    return data.categories || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}