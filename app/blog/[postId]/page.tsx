// app/blog/[postId]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/page';
import PostContentWrapper from '@/app/components/PostContentWrapper';

interface BlogPostPageProps {
  params: Promise<{ postId: string }>;
}

// Mock data without pre-rendered content
const mockPostsBase: PostCardProps[] = [
  {
    id: 'eb6958c7-2a84-4e50-8142-6ff6cd7a16e4',
    title: 'Test Post',
    description: 'A sample blog post for testing.',
    status: 'published',
    category: 'Test',
    tags: ['test', 'sample'],
    author: 'Test Author',
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello, world!' }] }],
    },
    minutesToRead: 5,
    createdAt: '2025-03-01T00:00:00Z',
    published_at: '2025-03-01T00:00:00Z',
    scheduled_publish_at: null,
  },
];

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ postId: post.id }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postId } = await params;
  const post = await getPostById(postId);
  if (!post) notFound();

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
          <PostContentWrapper content={post.content} />
        </div>
      </article>
    </div>
  );
}

async function getAllPosts(): Promise<PostCardProps[]> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return mockPostsBase;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.posts as PostCardProps[];
  } catch (error) {
    console.error('Error in getAllPosts():', error);
    return [];
  }
}

async function getPostById(postId: string): Promise<PostCardProps | null> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return mockPostsBase.find((p) => p.id === postId) || null;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.post as PostCardProps;
  } catch (error) {
    console.error('Error in getPostById():', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const post = await getPostById(postId);
  return {
    title: post?.title || 'Post Not Found',
    description: post?.description || 'This post does not exist.',
  };
}