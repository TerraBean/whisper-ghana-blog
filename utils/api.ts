import { PostCardProps } from "@/app/page";

// utils/api.ts
export async function getRecentPosts(): Promise<PostCardProps[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const url = new URL(`${baseUrl}/api/posts/recent`);
      url.searchParams.append('status', 'published');
  
      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
  
      const data = await response.json();
  
      if (!data?.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid posts array in response');
      }
  
      return data.posts as PostCardProps[];
    } catch (error) {
      console.error('Critical error in getRecentPosts:', error);
      return [];
    }
  }