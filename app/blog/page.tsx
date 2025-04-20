// app/blog/page.tsx
import React from 'react';
import { getRecentPosts } from '@/utils/api';
import PostCard from '@/app/components/PostCard';
import CategoryNavigation from '@/app/components/CategoryNavigation';
import BackToTop from '@/app/components/BackToTop';

const BlogPage = async () => {
  const { posts } = await getRecentPosts(1000); // Fetch all posts (adjust limit as needed)

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 rounded-xl shadow-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">Explore our thoughts, ideas, and insights</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No posts available at the moment. Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-center">Explore our thoughts, ideas, and insights</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <CategoryNavigation />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} className="h-full" />
          ))}
        </div>
      </div>
      
      <BackToTop />
    </div>
  );
};

export default BlogPage;