// lib/data-fetching.ts

import { PostCardProps } from '@/app/types'; // Adjust path if needed

export async function getPosts(): Promise<PostCardProps[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: 'no-store' // or 'force-cache' as needed
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return (data.posts || []) as PostCardProps[];
}

// You can add other data fetching functions here later