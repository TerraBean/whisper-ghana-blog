'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the Category type to match what the API returns
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  created_at?: string;
}

const CategoryNavigation: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        console.log("Categories data:", data); // Debug log to see what's coming from the API
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="bg-gray-100 p-4 mb-8">
      <h2 className="text-xl font-semibold mb-2">Browse Categories</h2>
      <ul className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/blog/categories/${category.name}`} className="text-blue-600 hover:underline">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;