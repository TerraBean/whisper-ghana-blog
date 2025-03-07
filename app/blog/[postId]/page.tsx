// app/blog/[postId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation'; // For handling 404 errors
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/page'; // Assuming PostCardProps is defined in app/page.tsx
import PostContent from '@/app/components/PostContent';

interface BlogPostPageProps {
  params: Awaited<{ postId: string }>; // Ensures compatibility with Promise-based params
}

export async function generateStaticParams() {
  const posts = await getAllPosts(); // Fetch all published posts
  return posts.map((post) => ({ postId: post.id }));
}

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const post = await getPostById(params.postId);

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

async function getAllPosts(): Promise<PostCardProps[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.posts as PostCardProps[];
  } catch (error) {
    console.error('Error in getAllPosts():', error);
    return [];
  }
}

async function getPostById(postId: string): Promise<PostCardProps | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.post as PostCardProps;
  } catch (error) {
    console.error('Error in getPostById():', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Awaited<{ postId: string }> }) {
  const post = await getPostById(params.postId);

  return {
    title: post?.title || 'Post Not Found',
    description: post?.description || 'This post does not exist.',
  };
}

export default BlogPostPage;