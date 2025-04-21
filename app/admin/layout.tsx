'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from './header';
import AdminTabsLayout from './AdminTabsLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isEditor } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Avoid duplicate redirects
    if (isRedirecting) return;
    
    // Redirect if not authenticated or not admin/editor
    if (!isAuthenticated) {
      setIsRedirecting(true);
      router.push('/auth/signin');
      return;
    }

    if (!isAdmin && !isEditor) {
      setIsRedirecting(true);
      router.push('/');
      return;
    }

    // Reset redirecting state if auth check passes
    setIsRedirecting(false);
  }, [isAuthenticated, isAdmin, isEditor, router, isRedirecting]);

  // Track pathname changes to reset redirecting state
  useEffect(() => {
    setIsRedirecting(false);
  }, [pathname]);

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
