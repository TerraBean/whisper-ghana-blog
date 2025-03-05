// app/blog/[postId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation'; // For handling 404 errors
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/page'; // Assuming PostCardProps is defined in app/page.tsx
import PostContent from '@/app/components/PostContent';

interface BlogPostPageProps {
  params: Promise<{ postId: string }>;
}

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const { postId } = await params; // ✅ Await the Promise
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  const formattedDate = post.published_at
    ? format(parseISO(post.published_at), 'MMM d, yyyy')
    : 'Draft';

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="mb-6 text-gray-600 flex items-center space-x-4">
          <span>Category: {post.category || 'Uncategorized'}</span>
          <span>Published: {formattedDate}</span>
          <span>Author: {post.author || 'Unknown'}</span>
          <span>{post.minutesToRead} min read</span>
        </div>
        <div className="prose max-w-none">
          <PostContent content={post.content} />
        </div>
      </article>
    </div>
  );
};


async function getPostById(postId: string): Promise<PostCardProps | null> {
  try {
    // Use proper URL construction with protocol
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://whisper-ghana-blog.vercel.app'
      : 'http://localhost:3000';

    // Use URL constructor for proper encoding
    const url = new URL(`${baseUrl}/api/posts/${postId}`);

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } // Optional revalidation
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data?.post) {
      throw new Error('Invalid post response structure');
    }

    return data.post as PostCardProps;

  } catch (error) {
    console.error('Error in getPostById():', error);
    return null;
  }
}


export default BlogPostPage;