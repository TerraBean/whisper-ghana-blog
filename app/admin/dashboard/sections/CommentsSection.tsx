import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  postId: string;
  postTitle: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
}

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetchRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchComments = async () => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;
      
      try {
        setIsLoading(true);
        // Simulated comments data - replace with actual API call
        // We'll simulate this for now since we assume the API endpoint exists but isn't shown in the folder structure
        
        // In a real implementation, this would be:
        // const response = await fetch('/api/comments?limit=3&sort=recent', { signal });
        // const data = await response.json();
        
        // Simulate delayed response for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const simulatedComments: Comment[] = [
          {
            id: 'comment1',
            content: "This article was extremely helpful. I've been struggling with React hooks for weeks and your explanation finally made it click!",
            author: {
              id: 'user1',
              name: 'Sarah Johnson',
              avatar: '/assets/avatars/sarah.jpg'
            },
            postId: 'post1',
            postTitle: 'Understanding React Hooks',
            createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
            status: 'approved'
          },
          {
            id: 'comment2',
            content: "I disagree with your take on Redux. Context API isn't always the best solution for complex state management.",
            author: {
              id: 'user2',
              name: 'Michael Chen',
            },
            postId: 'post2',
            postTitle: 'State Management in React',
            createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
            status: 'pending'
          },
          {
            id: 'comment3',
            content: "Great overview of the NextJS App Router! Could you do a follow-up on handling dynamic routes?",
            author: {
              id: 'user3',
              name: 'Priya Patel',
              avatar: '/assets/avatars/priya.jpg'
            },
            postId: 'post3',
            postTitle: 'NextJS 13 App Router',
            createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
            status: 'approved'
          }
        ];
        
        setComments(simulatedComments);
        
        // Save to cache right after fetching instead of in a separate useEffect
        if (simulatedComments.length > 0) {
          const cacheKey = 'dashboard-comments';
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: simulatedComments,
              timestamp: Date.now()
            })
          );
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use cache if available for faster rendering
    const cacheKey = 'dashboard-comments';
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
        
        if (!isExpired) {
          setComments(data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Cache error, fetch fresh data
      }
    }
    
    fetchComments();
    
    return () => {
      controller.abort();
    };
  }, []);
  
  // Remove the second useEffect that was causing the infinite update loop
  
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'spam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Comments</h2>
        <Link href="/admin/manage-comments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  {comment.author.avatar ? (
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="h-8 w-8 rounded-full mr-2 border border-gray-200 dark:border-gray-700" 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        {comment.author.name.substring(0, 1)}
                      </span>
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.author.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeStyle(comment.status)}`}>
                    {comment.status}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {comment.content}
              </p>
              
              <div className="flex justify-between text-xs">
                <Link 
                  href={`/blog/${comment.postId}`}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  On: {comment.postTitle}
                </Link>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-2 pt-2 text-center">
            <Link 
              href="/admin/manage-comments" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage all comments
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No comments found.
        </div>
      )}
    </div>
  );
};

export default CommentsSection;