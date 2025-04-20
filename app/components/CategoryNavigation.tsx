'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

const CategoryNavigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Check if current path is active
  const isActive = (path: string) => pathname === path;
  
  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-3">
        <Link
          href="/blog"
          className={`whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
            isActive('/blog')
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Posts
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/categories/${encodeURIComponent(category.name)}`}
            className={`whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
              pathname?.includes(`/categories/${encodeURIComponent(category.name)}`)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-30">
                {category.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;