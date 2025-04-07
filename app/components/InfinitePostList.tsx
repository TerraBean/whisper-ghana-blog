'use client';

import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import { PostCardProps } from '../types';
import { getRecentPosts, getPostsByCategory } from '@/utils/api';

interface InfinitePostListProps {
  initialPosts: PostCardProps[];
  category?: string; // Optional category prop
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({ initialPosts, category }) => {
  const [posts, setPosts] = useState<PostCardProps[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState<number>(initialPosts.length);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug function
  const debug = (message: string, ...args: any[]) => {
    console.log(`[InfinitePostList] ${message}`, ...args);
  };

  const loadMore = async () => {
    if (isLoading) {
      debug('Already loading, skipping request');
      return;
    }
    
    if (!hasMore) {
      debug('No more posts to load');
      return;
    }
    
    try {
      setIsLoading(true);
      debug(`Loading more posts with offset ${offset}`);
      
      let result;
      if (category) {
        result = await getPostsByCategory(category, 6, offset);
      } else {
        // Make sure to pass a NUMBER for offset, not a boolean or undefined
        result = await getRecentPosts(6, offset, false);
      }
      
      debug(`Loaded ${result.posts.length} more posts`);
      
      if (result.posts.length === 0) {
        debug('No more posts returned, setting hasMore=false');
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...result.posts]);
        setOffset(prevOffset => prevOffset + result.posts.length);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Proactively load more posts if content doesn't fill the viewport
  useEffect(() => {
    const checkHeightAndLoad = () => {
      if (!containerRef.current || !hasMore || isLoading) return;

      const containerHeight = containerRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;

      debug(`Container height: ${containerHeight}, Viewport: ${viewportHeight}`);
      
      if (containerHeight <= viewportHeight) {
        debug('Container smaller than viewport, loading more');
        loadMore();
      }
    };

    // Add a slight delay to ensure DOM is rendered
    const timer = setTimeout(checkHeightAndLoad, 300);
    
    window.addEventListener('resize', checkHeightAndLoad);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkHeightAndLoad);
    };
  }, [posts.length, hasMore, isLoading]);

  debug(`Rendering with ${posts.length} posts, hasMore=${hasMore}, offset=${offset}`);

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 className="text-center py-4">Loading more posts...</h4>}
        endMessage={<p className="text-center py-4">You've seen all our posts</p>}
        scrollThreshold={0.7} // Load a bit earlier for better UX
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default InfinitePostList;