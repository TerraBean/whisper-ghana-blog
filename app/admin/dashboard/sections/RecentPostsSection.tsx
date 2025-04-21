// Ensure this component is treated as a Client Component
"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  publishedAt?: string;
  views?: number;
}

interface RecentPostsSectionProps {
  timeframe: string;
  onLoaded: () => void;
}

// Define the fetcher function for SWR
// It receives the key (API endpoint or identifier) as an argument
const fetchRecentPosts = async (key: string): Promise<Post[]> => {
  // Extract timeframe from the key (e.g., '/api/posts/recent?timeframe=month')
  const url = new URL(key, 'http://localhost'); // Base URL is needed for URLSearchParams
  const timeframe = url.searchParams.get('timeframe') || 'week'; // Default to 'week' if not found

  // In a production app, this would be a real API call:
  // const response = await fetch(key);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch posts');
  // }
  // const data = await response.json();
  // return data;

  // Simulate network delay for demonstration
  await new Promise(resolve => setTimeout(resolve, 200));

  // Simulate different posts based on timeframe (same logic as before)
  const simulatedPosts: Post[] = [
    {
      id: 'post1',
      title: 'Getting Started with React Server Components',
      slug: 'getting-started-react-server-components',
      status: 'published',
      author: { id: 'user1', name: 'John Doe' },
      createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
      publishedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
      views: 230
    },
    {
      id: 'post2',
      title: 'Optimizing Next.js Applications',
      slug: 'optimizing-nextjs-applications',
      status: 'published',
      author: { id: 'user2', name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      publishedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
      views: 542
    },
    {
      id: 'post3',
      title: 'Advanced TypeScript Patterns for React',
      slug: 'advanced-typescript-patterns-react',
      status: 'draft',
      author: { id: 'user1', name: 'John Doe' },
      createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    },
    {
      id: 'post4',
      title: 'Building Accessible Web Applications',
      slug: 'building-accessible-web-applications',
      status: 'scheduled',
      author: { id: 'user3', name: 'Alex Johnson' },
      createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
      publishedAt: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
    },
    {
      id: 'post5',
      title: 'State Management in 2025',
      slug: 'state-management-2025',
      status: 'published',
      author: { id: 'user2', name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
      publishedAt: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
      views: 178
    }
  ];

  // Filter posts based on timeframe (this would usually be done server-side)
  const filteredPosts = timeframe === 'month' ?
    simulatedPosts :
    (timeframe === 'year' ?
      [...simulatedPosts,
        {
          id: 'post6',
          title: 'Legacy Post from Last Quarter',
          slug: 'legacy-post-last-quarter',
          status: 'published' as const, // Keep the type assertion
          author: { id: 'user1', name: 'John Doe' },
          createdAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
          publishedAt: new Date(Date.now() - 89 * 24 * 3600000).toISOString(),
          views: 1245
        }
      ] :
      simulatedPosts.slice(0, 4)
    );

  return filteredPosts;
};

const RecentPostsSection: React.FC<RecentPostsSectionProps> = ({ timeframe, onLoaded }) => {
  // Construct the key for SWR based on the timeframe
  const swrKey = `/api/posts/recent?timeframe=${timeframe}&limit=5`;

  // Use the SWR hook
  const { data: posts, error, isLoading } = useSWR<Post[]>(swrKey, fetchRecentPosts, {
    // Optional SWR configuration:
    // revalidateOnFocus: false, // Disable revalidation on window focus if needed
    // refreshInterval: 60000, // Revalidate every 60 seconds
  });

  const onLoadedCalledRef = useRef(false);

  // Effect to call onLoaded when data is successfully loaded
  useEffect(() => {
    if (posts && !isLoading && !onLoadedCalledRef.current) {
      onLoaded();
      onLoadedCalledRef.current = true;
    }
    // Reset the ref if the timeframe changes (which triggers a new load)
    return () => {
      onLoadedCalledRef.current = false;
    };
  }, [posts, isLoading, onLoaded, timeframe]); // Include timeframe to reset ref

  // Get status badge style (no changes needed)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Draft</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Scheduled</span>;
      default:
        return null;
    }
  };

  // Format date for display (no changes needed)
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle error state
  if (error) {
    console.error("SWR Fetching Error:", error);
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-red-600 dark:text-red-400">
        Error loading recent posts. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
        <Link href="/admin/manage-posts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>

      {/* Use SWR's isLoading state */}
      {isLoading ? (
        <div className="animate-pulse">
          {/* Skeleton loader remains the same */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="hidden md:flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
            <div className="w-1/2">Title</div>
            <div className="w-1/4 text-center">Status</div>
            <div className="w-1/4 text-right">Published</div>
          </div>

          {/* Use posts data from SWR */}
          {posts && posts.length > 0 ? (
            <div>
              {posts.map((post: Post) => ( // Explicitly type 'post'
                <div key={post.id} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="w-full md:w-1/2 mb-2 md:mb-0">
                    <Link
                      href={`/admin/edit-post/${post.id}`}
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                      {post.title}
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      by {post.author.name} • {post.views ? `${post.views} views` : 'No views yet'}
                    </div>
                  </div>
                  <div className="w-full md:w-1/4 flex md:justify-center mb-2 md:mb-0">
                    {getStatusBadge(post.status)}
                  </div>
                  <div className="w-full md:w-1/4 text-left md:text-right text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-2 text-center">
                <Link
                  href="/admin/manage-posts"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage all posts
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              No posts found in this timeframe.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentPostsSection;