'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

// Lazy load components to reduce initial bundle size
const RecentPostsSection = lazy(() => import('./sections/RecentPostsSection'));
const CategoriesSection = lazy(() => import('./sections/CategoriesSection'));
const ActivityLogSection = lazy(() => import('./sections/ActivityLogSection'));
const CommentsSection = lazy(() => import('./sections/CommentsSection'));

// Load immediately needed components
import DashboardCard from './components/DashboardCard';
import QuickActionButton from './components/QuickActionButton';
import LoadingSkeleton from './components/LoadingSkeleton';

// Icons - keeping these small and inline since they're needed immediately
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PublishedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const DraftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Custom hooks for data fetching with caching
function useStats(timeframe: string, isAdmin: boolean, isAuthenticated: boolean) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Return early if not authenticated
    if (!isAuthenticated) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchRealStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch actual post statistics with status counts
        const postsResponse = await fetch('/api/posts/recent?stats=true', { signal });
        const postsData = await postsResponse.json();
        
        // Get real counts from the API response
        const totalCount = postsData.totalCount || 0;
        const publishedCount = postsData.publishedCount || 0;
        const draftCount = postsData.draftCount || 0;
        
        // Only fetch users if admin
        let usersCount = 0;
        if (isAdmin) {
          const usersResponse = await fetch('/api/admin/users', { signal });
          const usersData = await usersResponse.json();
          usersCount = usersData.users?.length || 0;
        }
        
        setStats({
          totalPosts: totalCount,
          totalUsers: usersCount,
          publishedPosts: publishedCount,
          draftPosts: draftCount,
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error fetching dashboard stats:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Use localStorage for cache with a 5-minute expiration
    const cacheKey = `dashboard-stats-${timeframe}-${isAdmin}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
        
        if (!isExpired) {
          setStats(data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Cache parsing error, ignore and fetch fresh data
      }
    }
    
    fetchRealStats();
    
    // Cache the new data when it's fetched
    const unsubscribe = () => {
      if (stats.totalPosts > 0) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: stats,
            timestamp: Date.now()
          })
        );
      }
    };
    
    return () => {
      controller.abort();
      unsubscribe();
    };
  }, [timeframe, isAdmin, isAuthenticated]);

  return { stats, isLoading };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, isEditor, isAuthenticated } = useAuth();
  const [timeframe, setTimeframe] = useState('week');
  const [sectionsLoaded, setSectionsLoaded] = useState({
    recentPosts: false,
    categories: false,
    activityLog: false
  });
  
  // Authentication redirection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    } else if (!isAdmin && !isEditor) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isEditor, router]);
  
  // Use optimized stats hook
  const { stats, isLoading } = useStats(timeframe, isAdmin || false, isAuthenticated || false);
  
  // Track when sections are loaded to show progress
  const handleSectionLoaded = (section: string) => {
    setSectionsLoaded(prev => ({
      ...prev,
      [section]: true
    }));
  };
  
  // Different content based on user role
  const renderRoleSpecificContent = () => {
    if (isAdmin) {
      return (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <DashboardCard 
              title="Total Posts" 
              value={stats.totalPosts.toString()} 
              icon={<DocumentIcon />} 
              bgColor="bg-blue-50 dark:bg-blue-900/30" 
              textColor="text-blue-700 dark:text-blue-300"
              link="/admin/manage-posts"
              subtitle="All blog posts"
              isLoading={isLoading}
            />
            
            <DashboardCard 
              title="Published" 
              value={stats.publishedPosts.toString()} 
              icon={<PublishedIcon />} 
              bgColor="bg-green-50 dark:bg-green-900/30" 
              textColor="text-green-700 dark:text-green-300"
              subtitle="Live articles"
              isLoading={isLoading}
            />
            
            <DashboardCard 
              title="Drafts" 
              value={stats.draftPosts.toString()} 
              icon={<DraftIcon />} 
              bgColor="bg-amber-50 dark:bg-amber-900/30" 
              textColor="text-amber-700 dark:text-amber-300"
              subtitle="In progress"
              isLoading={isLoading}
            />
            
            <DashboardCard 
              title="Users" 
              value={stats.totalUsers.toString()} 
              icon={<UsersIcon />} 
              bgColor="bg-purple-50 dark:bg-purple-900/30" 
              textColor="text-purple-700 dark:text-purple-300"
              link="/admin/manage-users"
              subtitle="Team members"
              isLoading={isLoading}
            />
          </div>
          
          {/* Admin quick actions */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton
                  title="New Post"
                  icon={<PlusIcon />}
                  link="/admin/create-post"
                  bgColor="bg-indigo-600 hover:bg-indigo-700"
                />
                <QuickActionButton
                  title="Manage Users"
                  icon={<UsersIcon />}
                  link="/admin/manage-users"
                  bgColor="bg-purple-600 hover:bg-purple-700"
                />
                <QuickActionButton
                  title="Manage Posts"
                  icon={<DocumentIcon />}
                  link="/admin/manage-posts"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                />
                <QuickActionButton
                  title="View Site"
                  icon={<ExternalLinkIcon />}
                  link="/"
                  bgColor="bg-green-600 hover:bg-green-700"
                />
              </div>
            </div>
          </div>
          
          {/* Main content area with staggered loading */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent content section - load first */}
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingSkeleton type="table" />}>
                <RecentPostsSection 
                  timeframe={timeframe} 
                  onLoaded={() => handleSectionLoaded('recentPosts')} 
                />
              </Suspense>
            </div>
            
            <div className="space-y-6">
              {/* Categories section - load second */}
              <Suspense fallback={<LoadingSkeleton type="list" />}>
                <CategoriesSection 
                  onLoaded={() => handleSectionLoaded('categories')} 
                />
              </Suspense>
              
              {/* Activity Log - load last */}
              <Suspense fallback={<LoadingSkeleton type="activity" />}>
                <ActivityLogSection 
                  isAdmin={isAdmin} 
                  onLoaded={() => handleSectionLoaded('activityLog')} 
                />
              </Suspense>
            </div>
          </div>

          {/* Comments section - load last */}
          <div className="mt-6">
            <Suspense fallback={<LoadingSkeleton type="comments" />}>
              <CommentsSection />
            </Suspense>
          </div>
        </>
      );
    } else if (isEditor) {
      return (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DashboardCard 
              title="Total Posts" 
              value={stats.totalPosts.toString()} 
              icon={<DocumentIcon />} 
              bgColor="bg-blue-50 dark:bg-blue-900/30" 
              textColor="text-blue-700 dark:text-blue-300"
              link="/admin/manage-posts"
              subtitle="All blog posts"
              isLoading={isLoading}
            />
            
            <DashboardCard 
              title="Published" 
              value={stats.publishedPosts.toString()} 
              icon={<PublishedIcon />} 
              bgColor="bg-green-50 dark:bg-green-900/30" 
              textColor="text-green-700 dark:text-green-300"
              subtitle="Live articles"
              isLoading={isLoading}
            />
            
            <DashboardCard 
              title="Drafts" 
              value={stats.draftPosts.toString()} 
              icon={<DraftIcon />} 
              bgColor="bg-amber-50 dark:bg-amber-900/30" 
              textColor="text-amber-700 dark:text-amber-300"
              subtitle="In progress"
              isLoading={isLoading}
            />
          </div>
          
          {/* Editor quick actions */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <QuickActionButton
                  title="New Post"
                  icon={<PlusIcon />}
                  link="/admin/create-post"
                  bgColor="bg-indigo-600 hover:bg-indigo-700"
                />
                <QuickActionButton
                  title="Manage Posts"
                  icon={<DocumentIcon />}
                  link="/admin/manage-posts"
                  bgColor="bg-blue-600 hover:bg-blue-700"
                />
                <QuickActionButton
                  title="View Site"
                  icon={<ExternalLinkIcon />}
                  link="/"
                  bgColor="bg-green-600 hover:bg-green-700"
                />
              </div>
            </div>
          </div>
          
          {/* Content area with staggered loading */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent content section - load first */}
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingSkeleton type="table" />}>
                <RecentPostsSection 
                  timeframe={timeframe} 
                  onLoaded={() => handleSectionLoaded('recentPosts')} 
                />
              </Suspense>
            </div>
            
            <div className="space-y-6">
              {/* Categories section - load second */}
              <Suspense fallback={<LoadingSkeleton type="list" />}>
                <CategoriesSection 
                  onLoaded={() => handleSectionLoaded('categories')} 
                />
              </Suspense>
              
              {/* Activity Log - load last */}
              <Suspense fallback={<LoadingSkeleton type="activity" />}>
                <ActivityLogSection 
                  isAdmin={false} 
                  onLoaded={() => handleSectionLoaded('activityLog')} 
                />
              </Suspense>
            </div>
          </div>
          
          {/* Comments section - load last */}
          <div className="mt-6">
            <Suspense fallback={<LoadingSkeleton type="comments" />}>
              <CommentsSection />
            </Suspense>
          </div>
        </>
      );
    } else {
      // This should not happen due to the authentication redirect
      return (
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg text-amber-800 dark:text-amber-200">
          You don't have the required permissions to access this page.
        </div>
      );
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name || 'User'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAdmin ? 'Administrator Dashboard' : 'Editor Dashboard'} | {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={() => {
              // Clear cache and reload stats
              const cacheKeys = ['dashboard-stats-week', 'dashboard-stats-month', 'dashboard-stats-year'];
              cacheKeys.forEach(key => localStorage.removeItem(key));
              window.location.reload();
            }}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
          
      {renderRoleSpecificContent()}
    </div>
  );
}
