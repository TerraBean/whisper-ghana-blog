import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoriesSectionProps {
  onLoaded: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onLoaded }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetchRef = useRef(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchCategories = async () => {
      if (didFetchRef.current) return;
      
      didFetchRef.current = true;
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories?withCounts=true', { signal });
        const data = await response.json();
        
        const newCategories = data.categories || [];
        setCategories(newCategories);
        
        // Save to cache right after fetching instead of in a separate useEffect
        if (newCategories.length > 0) {
          const cacheKey = 'dashboard-categories';
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: newCategories,
              timestamp: Date.now()
            })
          );
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
        onLoaded();
      }
    };
    
    // Use cache if available
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      
      const cacheKey = 'dashboard-categories';
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > 15 * 60 * 1000; // 15 minutes
          
          if (!isExpired) {
            setCategories(data);
            setIsLoading(false);
            onLoaded();
            return;
          }
        } catch (e) {
          // Cache error, fetch fresh data
        }
      }
      
      fetchCategories();
    }
    
    return () => {
      controller.abort();
    };
  }, [onLoaded]);
  
  // Remove the second useEffect that was causing the infinite update loop
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <Link 
                href={`/blog/categories/${category.slug}`} 
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {category.name}
              </Link>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No categories found.
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;