// app/blog/page.tsx
import React from 'react';
import { getRecentPosts } from '@/utils/api';
import PostCard from '@/app/components/PostCard'; // Import PostCard

const BlogPage = async () => {
  const { posts } = await getRecentPosts(1000); // Fetch all posts (adjust limit as needed)

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Blog Posts</h1>
        <p className="text-gray-600">No posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">All Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;