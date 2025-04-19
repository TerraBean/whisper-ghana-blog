'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from './header';
import AdminTabsLayout from './AdminTabsLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isEditor } = useAuth();
  
  React.useEffect(() => {
    // Redirect if not authenticated or not admin/editor
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (!isAdmin && !isEditor) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isAdmin, isEditor, router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <AdminTabsLayout>
          {children}
        </AdminTabsLayout>
      </main>
    </div>
  );
}
