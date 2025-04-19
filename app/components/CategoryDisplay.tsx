'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug?: string;
  count?: number;
}

export default function CategoryDisplay() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if current category is active
  const isActive = (categoryName: string) => {
    return pathname?.includes(`/categories/${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        
        // Transform the data to include post counts if available
        const categoriesWithCounts = data.categories.map((category: Category) => ({
          ...category,
          slug: category.name.toLowerCase().replace(/\s+/g, '-'),
          count: category.count || 0
        }));
        
        setCategories(categoriesWithCounts);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Categories</h2>
      
      <div className="space-y-2">
        <Link 
          href="/blog"
          className={`block px-3 py-2 rounded-md text-sm ${
            pathname === '/blog' 
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          All Posts
        </Link>
        
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/blog/categories/${encodeURIComponent(category.name)}`}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
              isActive(category.name) 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span>{category.name}</span>
            {category.count !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                {category.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
