import React from 'react';
import CategoryNavigation from '@/app/components/CategoryNavigation';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <CategoryNavigation />
      <main>{children}</main>
    </div>
  );
}