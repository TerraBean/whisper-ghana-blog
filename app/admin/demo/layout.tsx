'use client';

import React from 'react';
import AdminHeader from '../header';
import AdminTabsLayout from '../AdminTabsLayout';

// Special demo layout that doesn't require authentication
export default function AdminDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
