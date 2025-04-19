'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to the dashboard page
export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-indigo-400 dark:bg-indigo-600 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-indigo-400 dark:bg-indigo-600 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-indigo-300 dark:bg-indigo-700 rounded"></div>
            <div className="h-4 bg-indigo-300 dark:bg-indigo-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
