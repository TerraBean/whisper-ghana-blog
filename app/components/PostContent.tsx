'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Post } from '@/types';

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  // Optimization: Use ref for tracking if post content is visible, which helps with lazy loading
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Memoize formatted date to avoid recalculation on re-renders
  const formattedDate = useMemo(() => {
    if (!post.published_at) return null;
    return format(new Date(post.published_at), 'MMMM d, yyyy');
  }, [post.published_at]);

  // Optimized content rendering with intersection observer
  useEffect(() => {
    if (!contentRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(contentRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Pre-render essential content immediately, with full content when visible
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Always render the header for instant visibility */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 gap-y-2">
          {post.author && (
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author?.name || post.author_name || 'Unknown Author'}
            </span>
          )}
          
          {formattedDate && (
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          )}
          
          {post.category && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {post.category || post.categoryName || 'Uncategorized'}
            </span>
          )}
        </div>
      </header>

      {/* Featured image with priority loading for better LCP */}
      {post.featured_image && (
        <div className="mb-8 relative rounded-lg overflow-hidden shadow-lg aspect-video">
          <Image
            src={post.featured_image}
            alt={post.title}
            priority={true} // Load with high priority for faster LCP
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main content with optimized loading */}
      <div 
        ref={contentRef}
        className="prose dark:prose-invert max-w-none prose-lg prose-indigo"
      >
        {/* Skeleton loader shown before content is visible */}
        {!isVisible ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          </div>
        ) : (
          // Optimized content rendering using dangerouslySetInnerHTML for better performance
          // The content should already be sanitized server-side before reaching here
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        )}
      </div>

      {/* Tags section */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostContent;