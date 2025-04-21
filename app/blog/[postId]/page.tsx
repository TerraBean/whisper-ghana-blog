// app/blog/[postId]/page.tsx
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/types';
import PostContentWrapper from '@/app/components/PostContentWrapper';
import CategoryDisplay from '@/app/components/CategoryDisplay';
import BackToTop from '@/app/components/BackToTop';
import PostContent from '@/app/components/PostContent';

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

// Define generateMetadata for better SEO and performance
export async function generateMetadata({ params }: { params: { postId: string } }) {
  // Fetch data in parallel with the page content
  const post = await fetchPost(params.postId);
  
  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Whisper Ghana`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Whisper Ghana`,
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: post.author?.name || post.author_name,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Whisper Ghana`,
      images: post.featured_image ? [post.featured_image] : [],
    }
  };
}

// Add dynamic parameters to allow for incremental static regeneration
export const dynamicParams = true;

// Optimize data fetching with caching and parallel requests
async function fetchPost(postId: string) {
  try {
    // Use a proper URL construction with base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // Ensure we have a valid URL by joining the base URL and path properly
    const url = new URL(`/api/posts/${postId}`, baseUrl);
    
    const res = await fetch(url.toString(), {
      next: { 
        revalidate: 300, // Cache for 5 minutes
        tags: [`post-${postId}`], // Tag for targeted revalidation
      }
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }: BlogPostPageProps) { // Use the defined interface
  const { postId } = await params; // Await params and destructure postId
  const post = await fetchPost(postId); // Use the awaited postId
  
  if (!post) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={<div className="min-h-screen"></div>}>
        <PostContentWrapper>
          <PostContent post={post} />
        </PostContentWrapper>
      </Suspense>
      <BackToTop />
    </>
  );
}

async function getAllPosts(): Promise<PostCardProps[]> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return mockPostsBase;
  }
  try {
    // Fix URL construction here too
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL('/api/posts', baseUrl);
    
    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Use ISR instead of force-cache
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
    // Fix URL construction here as well
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`/api/posts/${postId}`, baseUrl);
    
    const response = await fetch(url.toString(), {
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