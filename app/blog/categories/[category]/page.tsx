import React from 'react';
import InfinitePostList from '@/app/components/InfinitePostList';
import { getPostsByCategory } from '@/utils/api';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { posts: initialPosts, total } = await getPostsByCategory(category, 6, 0);

  if (total === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          No Posts in &quot;{category}&quot;
        </h1>
        <p className="text-gray-600">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Posts in &quot;{category}&quot;
      </h1>
      <InfinitePostList initialPosts={initialPosts} category={category} />
    </div>
  );
}