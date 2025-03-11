import React from 'react';
import Link from 'next/link';
import { getRecentPosts } from '@/utils/api';
import PostCard from '@/app/components/PostCard';
import { PostCardProps } from './types';

// FeaturedPostCard with distinct styling
const FeaturedPostCard: React.FC<PostCardProps> = (props) => (
  <PostCard {...props} className="bg-yellow-100 border-yellow-300" />
);

const BlogIndexPage = async () => {
  const { posts: featuredPosts } = await getRecentPosts(3, true); // Fetch up to 3 featured posts
  const { posts: recentPosts, total } = await getRecentPosts(6); // Fetch 6 recent posts

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

      {/* Recent Posts Section */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      {total > 6 && (
        <div className="text-center mt-8">
          <Link href="/blog" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogIndexPage;