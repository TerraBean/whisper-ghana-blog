// app/blog/[postId]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/types';
import PostContentWrapper from '@/app/components/PostContentWrapper';
import CategoryDisplay from '@/app/components/CategoryDisplay';
import BackToTop from '@/app/components/BackToTop';

interface BlogPostPageProps {
  params: Promise<{ postId: string }>; // Correct type for Next.js 15.1.6 dynamic route
}

// Mock data
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
  const { postId } = await params; // Await the params promise
  const post = await getPostById(postId);
  if (!post) notFound();

  const formattedDate = post.published_at
    ? format(parseISO(post.published_at), 'MMM d, yyyy')
    : 'Draft';

  // Get related posts (same category)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to all posts
          </Link>
        </div>

        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            {post.category && (
              <div className="mb-4">
                <CategoryDisplay category={post.category || 'Uncategorized'} />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{post.author || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{post.minutesToRead || 'N/A'} min read</span>
              </div>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PostContentWrapper content={post.content} />
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} {...relatedPost} className="h-full" />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <BackToTop />
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

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params; // Await params here too
  const post = await getPostById(postId);
  return {
    title: post?.title || 'Post Not Found',
    description: post?.description || 'This post does not exist.',
  };
}