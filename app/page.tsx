// app/page.tsx

import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getRecentPosts } from '@/utils/api';

export interface PostCardProps {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published'; // Ensure strict typing for status
  category: string;
  tags: string[]; // Array of tags
  author: string; // Author name
  content: any; // Tiptap JSON content (refine later if needed)
  minutesToRead: number;
  createdAt: string; // ISO date string
  published_at: string | null; // Published date (nullable for drafts)
  scheduled_publish_at: string | null; // Scheduled publish date (nullable)
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  category,
  minutesToRead,
  createdAt,
}) => {
  const formattedDate = format(parseISO(createdAt), 'MMM d, yyyy');

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/blog/${id}`} className="block no-underline">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-700 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Category: {category}</span>
          <span className="text-sm text-gray-500">{minutesToRead} min read</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Created at: {formattedDate}</p>
      </Link>
    </div>
  );
};

// --- BlogIndexPage Component (Now as Server Component for SSG) ---
const BlogIndexPage = async () => {
  const posts = await getRecentPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Our Blog</h1>
        <p className="text-gray-600">No posts available at the moment. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

// --- Function to Fetch Recent Posts (Server-Side) ---


export default BlogIndexPage;