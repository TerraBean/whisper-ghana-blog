'use client';

import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import { PostCardProps } from '../types';
import { getRecentPosts, getPostsByCategory } from '@/utils/api'; // Adjust path as needed

interface InfinitePostListProps {
  initialPosts: PostCardProps[];
  category?: string; // Optional category prop
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({ initialPosts, category }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);
  const isFetchingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const fetchFunction = category
        ? () => getPostsByCategory(category, 6, offset)
        : () => getRecentPosts(6);

      const { posts: newPosts } = await fetchFunction();

      if (newPosts.length < 6) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setOffset((prevOffset) => prevOffset + newPosts.length);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Proactively load more posts if content doesn't fill the viewport
  useEffect(() => {
    const checkHeightAndLoad = () => {
      if (!containerRef.current || !hasMore || isFetchingRef.current) return;

      const containerHeight = containerRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (containerHeight <= viewportHeight) {
        loadMore(); // Load more if content doesn't overflow
      }
    };

    checkHeightAndLoad(); // Run on mount
    window.addEventListener('resize', checkHeightAndLoad); // Handle resize
    return () => window.removeEventListener('resize', checkHeightAndLoad);
  }, [posts, hasMore]);

  return (
    <div ref={containerRef}>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 className="text-center py-4">Loading...</h4>}
        endMessage={<p className="text-center py-4">No more posts</p>}
        scrollThreshold={0.9} // Trigger loadMore when 90% scrolled
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