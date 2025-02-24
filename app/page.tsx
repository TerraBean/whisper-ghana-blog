// app/page.tsx

import React from 'react'; // useState and useEffect are removed
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export interface PostCardProps { // Ensure 'export' is still there
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[]; // Add tags property to the interface to match database
  author: string;     // Add author property
  content: any;    // Add content property (type 'any' for Tiptap JSON for now, refine later if needed)
  minutesToRead: number;
  createdAt: string;
  publishedAt: string | null; // Add publishedAt property (can be null for drafts)
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
        <p className="text-sm text-gray-500 mt-2">Published on: {formattedDate}</p>
      </Link>
    </div>
  );
};


// --- BlogIndexPage Component (Now as Server Component for SSG) ---
const BlogIndexPage = async () => { // Marked as async to fetch data
  const posts = await getRecentPosts(); // Fetch posts data on server

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

// --- Function to Fetch Recent Posts (Server-Side) ---
async function getRecentPosts(): Promise<PostCardProps[]> {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'; // Fallback for non-Vercel environments

  try {
    const response = await fetch(`${baseUrl}/api/posts/recent`); // Use baseUrl
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.posts as PostCardProps[];
  } catch (error) {
    console.error('Error fetching recent posts in getRecentPosts():', error);
    return [];
  }
}


export default BlogIndexPage;