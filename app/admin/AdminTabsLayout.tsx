'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

type TabItem = {
  name: string;
  href: string;
  visible: boolean;
};

export default function AdminTabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const tabs = [
    { name: 'Dashboard', href: '/admin/dashboard', visible: true },
    { name: 'Create Post', href: '/admin/create-post', visible: true },
    { name: 'Manage Posts', href: '/admin/manage-posts', visible: true },
    { name: 'Manage Users', href: '/admin/manage-users', visible: isAdmin },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen">
      {/* Tabs navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {tabs
            .filter(tab => tab.visible)
            .map((tab) => (
              <li key={tab.name} className="mr-2">
                <Link
                  href={tab.href}
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg group ${
                    isActive(tab.href)
                      ? 'text-indigo-600 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
