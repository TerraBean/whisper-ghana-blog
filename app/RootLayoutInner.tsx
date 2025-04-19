'use client'; // **Make sure this is at the VERY TOP**

import React from 'react';
import { useTheme } from './contexts/ThemeContext';
import MainNavigation from './components/MainNavigation';

interface RootLayoutInnerProps {
  children: React.ReactNode;
  geistMonoVariable: string; // Prop to receive geistMono font variable
}

export const RootLayoutInner: React.FC<RootLayoutInnerProps> = ({ children, geistMonoVariable }) => {
  const { theme } = useTheme(); // Now useTheme() is correctly in Client Component

  return (
    <body className={`${geistMonoVariable} antialiased ${theme === 'dark' ? 'dark-theme' : ''}`}> {/* Apply geistMono font, antialiased, and dark-theme class to body */}
      <MainNavigation />
      <main className="min-h-screen">
        {children}
      </main>
    </body>
  );
};
