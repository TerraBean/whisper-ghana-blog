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

interface CategoryDisplayProps {
  category: string;
  asLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ 
  category, 
  asLink = true,
  size = 'md'
}) => {
  // Tailwind classes based on size
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Generate a consistent color based on category name
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  ];
  
  // Simple hash function to get a consistent color for the same category
  const getColorIndex = (str: string) => {
    let hash = 0;
    // Add null check before accessing length
    if (!str) return 0;
    
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % colors.length);
  };
  
  const colorClass = colors[getColorIndex(category)];
  const baseClasses = `rounded-full font-medium ${sizeClasses[size]} ${colorClass}`;
  
  if (asLink) {
    return (
      <Link 
        href={`/blog/categories/${encodeURIComponent(category)}`}
        className={`inline-block ${baseClasses} hover:opacity-90 transition-opacity`}
      >
        {category}
      </Link>
    );
  }
  
  return <span className={`inline-block ${baseClasses}`}>{category}</span>;
};

export default CategoryDisplay;

export function CategoryList() {
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
