// page.tsx
import React from 'react';
import { getRecentPosts } from '@/utils/api';
import PostCard from '@/app/components/PostCard';
import InfinitePostList from '@/app/components/InfinitePostList';
import { PostCardProps } from './types';

// FeaturedPostCard with distinct styling
const FeaturedPostCard: React.FC<PostCardProps> = (props) => (
  <PostCard {...props} className="bg-yellow-100 border-yellow-300" />
);

const BlogIndexPage = async () => {
  const { posts: featuredPosts } = await getRecentPosts(3, true); // Fetch up to 3 featured posts
  const { posts: initialRecentPosts } = await getRecentPosts(6); // Fetch initial 6 recent posts

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Stories Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <FeaturedPostCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts Section with Infinite Scroll */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Blog</h1>
      <InfinitePostList initialPosts={initialRecentPosts} />
    </div>
  );
};

export default BlogIndexPage;