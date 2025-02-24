// app/blog/[postId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation'; // For handling 404 errors
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/page'; // Assuming PostCardProps is defined in app/page.tsx
import PostContent from '@/app/components/PostContent';

interface BlogPostPageProps {
  params: {
    postId: string; // 'postId' should match the dynamic folder name: '[postId]'
  };
}

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const {postId} = await params;

  const post = await getPostById(postId);

  if (!post) {
    notFound(); // Next.js function to return 404 response
  }

  const formattedDate = post.publishedAt ? format(parseISO(post.publishedAt), 'MMM d, yyyy') : 'Draft';


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
          <PostContent content={post.content} /> {/* Use the PostContent Client Component */}
        </div>
      </article>
    </div>
  );
};


async function getPostById(postId: string): Promise<PostCardProps | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/posts/${postId}`); // Fetch single post API
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Handle 404 specifically (post not found)
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.post as PostCardProps; // Type assertion
  } catch (error) {
    console.error('Error fetching post by ID in getPostById():', error);
    return null; // Return null in case of error
  }
}


export default BlogPostPage;