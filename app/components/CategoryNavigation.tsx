'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CategoryNavigation: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const { categories } = await response.json();
        setCategories(categories);
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
          <li key={category}>
            <Link href={`/blog/categories/${category}`} className="text-blue-600 hover:underline">
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;