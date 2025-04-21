'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { prefetchPostActions } from '@/utils/prefetch';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  // Add safety check at the beginning
  if (!post) {
    return null;
  }

  const [isPrefetched, setIsPrefetched] = useState(false);
  
  // Handle post prefetching on hover
  const handleMouseEnter = useCallback(() => {
    if (!isPrefetched) {
      // Start prefetching the post page
      const postPath = `/blog/${post?.id}`;
      prefetchPostActions.prefetch({ path: postPath, data: post });
      setIsPrefetched(true);
    }
  }, [post, isPrefetched]);

  // Format the date
  const formattedDate = post?.published_at
    ? format(new Date(post.published_at), 'MMMM d, yyyy')
    : null;

  return (
    <article 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {post?.featured_image && (
        <Link href={`/blog/${post?.id}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title || 'Blog post'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {post?.category && (
            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </Link>
      )}
      
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post?.id}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            prefetch={true}
          >
            {post.title || 'Untitled Post'}
          </Link>
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post?.excerpt || post?.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            {formattedDate || 'No date available'}
          </div>
          
          {post?.author && (
            <div className="text-gray-500 dark:text-gray-400">
              By {post.author?.name || post?.author_name || 'Unknown'}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <Link 
            href={`/blog/${post?.id}`}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors inline-flex items-center group"
            prefetch={true}
          >
            Read more
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {post?.minutesToRead && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.minutesToRead} min read
            </span>
          )}
        </div>
      </div>
    </article>
  );
}