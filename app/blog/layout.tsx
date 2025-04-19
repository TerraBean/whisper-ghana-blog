import React from 'react';
import CategoryDisplay from '@/app/components/CategoryDisplay';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <CategoryDisplay />
          </div>
          
          {/* Main content */}
          <main className="w-full lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
