// components/InfinitePostList.tsx
'use client';

import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCard from './PostCard';
import { PostCardProps } from '../types';

interface InfinitePostListProps {
  initialPosts: PostCardProps[];
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);

  const loadMore = async () => {
    const response = await fetch(`/api/posts/recent?limit=6&offset=${offset}`);
    const { posts: newPosts } = await response.json();

    if (newPosts.length < 6) {
      setHasMore(false); // No more posts to load if fewer than limit are returned
    }

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + newPosts.length);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4 className="text-center">Loading...</h4>}
      endMessage={<p className="text-center">No more posts</p>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default InfinitePostList;