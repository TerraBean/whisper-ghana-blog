'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from '../header';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, isEditor, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    publishedPosts: 0,
    draftPosts: 0,
    recentPosts: [],
    categories: [],
    activityLog: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    // Redirect if not authenticated or not admin/editor
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (!isAdmin && !isEditor) {
      router.push('/');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch posts count
        const postsResponse = await fetch('/api/posts/recent?limit=1&offset=0');
        const postsData = await postsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch users count if admin
        let usersCount = 0;
        if (isAdmin) {
          const usersResponse = await fetch('/api/admin/users');
          const usersData = await usersResponse.json();
          usersCount = usersData.users?.length || 0;
        }
        
        // Fetch recent posts
        const recentPostsResponse = await fetch('/api/posts/recent?limit=5&offset=0');
        const recentPostsData = await recentPostsResponse.json();
        
        // Mock data for additional stats that would normally come from API
        // In a real implementation, you would fetch these from your API
        const publishedCount = Math.floor(postsData.totalCount * 0.8); // 80% published for mock
        const draftCount = postsData.totalCount - publishedCount;
        
        // Mock activity log
        const mockActivityLog = [
          { 
            action: 'Post Created', 
            user: 'John Doe', 
            target: 'Getting Started with Next.js', 
            timestamp: new Date(Date.now() - 3600000).toISOString() 
          },
          { 
            action: 'Post Edited', 
            user: 'Jane Smith', 
            target: 'Introduction to React Hooks', 
            timestamp: new Date(Date.now() - 7200000).toISOString() 
          },
          { 
            action: 'Comment Approved', 
            user: 'Admin', 
            target: 'Great article!', 
            timestamp: new Date(Date.now() - 10800000).toISOString() 
          },
          { 
            action: 'User Created', 
            user: 'Admin', 
            target: 'New Editor', 
            timestamp: new Date(Date.now() - 86400000).toISOString() 
          }
        ];
        
        setStats({
          totalPosts: postsData.totalCount || 0,
          totalUsers: usersCount,
          publishedPosts: publishedCount,
          draftPosts: draftCount,
          recentPosts: recentPostsData.posts || [],
          categories: categoriesData.categories || [],
          activityLog: mockActivityLog
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, isAdmin, isEditor, router, timeframe]);

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
            />
            
            <DashboardCard 
              title="Published" 
              value={stats.publishedPosts.toString()} 
              icon={<PublishedIcon />} 
              bgColor="bg-green-50 dark:bg-green-900/30" 
              textColor="text-green-700 dark:text-green-300"
              subtitle="Live articles"
            />
            
            <DashboardCard 
              title="Drafts" 
              value={stats.draftPosts.toString()} 
              icon={<DraftIcon />} 
              bgColor="bg-amber-50 dark:bg-amber-900/30" 
              textColor="text-amber-700 dark:text-amber-300"
              subtitle="In progress"
            />
            
            <DashboardCard 
              title="Users" 
              value={stats.totalUsers.toString()} 
              icon={<UsersIcon />} 
              bgColor="bg-purple-50 dark:bg-purple-900/30" 
              textColor="text-purple-700 dark:text-purple-300"
              link="/admin/manage-users"
              subtitle="Team members"
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
          
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent content section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
                  <Link 
                    href="/admin/manage-posts"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Title</th>
                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Status</th>
                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Date</th>
                        <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {stats.recentPosts.length > 0 ? (
                        stats.recentPosts.map((post: any) => (
                          <tr key={post.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                              {post.title}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                post.status === 'draft' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {post.status || 'Published'}
                              </span>
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                              {new Date(post.created_at).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link 
                                href={`/admin/edit-post/${post.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-4"
                              >
                                Edit
                              </Link>
                              <Link 
                                href={`/blog/${post.slug || post.id}`}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                target="_blank"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Categories section */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                  {stats.categories.length > 0 && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full px-2 py-1">
                      {stats.categories.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {stats.categories.length > 0 ? (
                    stats.categories.map((category: any) => (
                      <div key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                        <Link 
                          href={`/blog/categories/${encodeURIComponent(category.name)}`}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No categories</p>
                  )}
                </div>
              </div>
              
              {/* Activity Log */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {stats.activityLog.map((activity: any, activityIdx: number) => (
                      <li key={activityIdx}>
                        <div className="relative pb-8">
                          {activityIdx !== stats.activityLog.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                activity.action.includes('Created') ? 'bg-green-500' : 
                                activity.action.includes('Edited') ? 'bg-blue-500' : 
                                activity.action.includes('Approved') ? 'bg-indigo-500' : 'bg-gray-500'
                              }`}>
                                <ActivityIcon action={activity.action} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">{activity.action}</span> - {activity.target} by <span className="font-medium">{activity.user}</span>
                                </p>
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(new Date(activity.timestamp))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Comments</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Feature coming soon
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No comments available yet. We&apos;ll be adding comment functionality soon.
                </p>
              </div>
            </div>
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
            />
            
            <DashboardCard 
              title="Published" 
              value={stats.publishedPosts.toString()} 
              icon={<PublishedIcon />} 
              bgColor="bg-green-50 dark:bg-green-900/30" 
              textColor="text-green-700 dark:text-green-300"
              subtitle="Live articles"
            />
            
            <DashboardCard 
              title="Drafts" 
              value={stats.draftPosts.toString()} 
              icon={<DraftIcon />} 
              bgColor="bg-amber-50 dark:bg-amber-900/30" 
              textColor="text-amber-700 dark:text-amber-300"
              subtitle="In progress"
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
          
          {/* Content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent content section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
                  <Link 
                    href="/admin/manage-posts"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Title</th>
                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Status</th>
                        <th className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Date</th>
                        <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {stats.recentPosts.length > 0 ? (
                        stats.recentPosts.map((post: any) => (
                          <tr key={post.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                              {post.title}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm sm:table-cell">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                post.status === 'draft' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {post.status || 'Published'}
                              </span>
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                              {new Date(post.created_at).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link 
                                href={`/admin/edit-post/${post.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-4"
                              >
                                Edit
                              </Link>
                              <Link 
                                href={`/blog/${post.slug || post.id}`}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                target="_blank"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Categories section */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                  {stats.categories.length > 0 && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full px-2 py-1">
                      {stats.categories.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {stats.categories.length > 0 ? (
                    stats.categories.map((category: any) => (
                      <div key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                        <Link 
                          href={`/blog/categories/${encodeURIComponent(category.name)}`}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No categories</p>
                  )}
                </div>
              </div>
              
              {/* Activity Log (limited for editors) */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Recent Activity</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {stats.activityLog
                      .filter((activity: any) => !activity.action.includes('User'))
                      .slice(0, 3)
                      .map((activity: any, activityIdx: number) => (
                      <li key={activityIdx}>
                        <div className="relative pb-8">
                          {activityIdx !== Math.min(2, stats.activityLog.length - 1) ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                activity.action.includes('Created') ? 'bg-green-500' : 
                                activity.action.includes('Edited') ? 'bg-blue-500' : 'bg-indigo-500'
                              }`}>
                                <ActivityIcon action={activity.action} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">{activity.action}</span> - {activity.target}
                                </p>
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(new Date(activity.timestamp))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Comments</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Feature coming soon
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No comments available yet. We&apos;ll be adding comment functionality soon.
                </p>
              </div>
            </div>
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

  // Format timestamps into relative time
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
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
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 500); // Mock refresh
                }}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            renderRoleSpecificContent()
          )}
        </div>
      </main>
    </div>
  );
}

// Card Components
const DashboardCard = ({ title, value, icon, bgColor, textColor, link, subtitle }: any) => {
  const content = (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
          {subtitle && <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className={`${textColor} h-12 w-12 flex items-center justify-center rounded-lg bg-white bg-opacity-30 dark:bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );
  
  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  
  return content;
};

const QuickActionButton = ({ title, icon, link, bgColor }: any) => {
  return (
    <Link href={link} className={`${bgColor} text-white rounded-lg p-4 text-center flex flex-col items-center justify-center transition-colors duration-200`}>
      <span className="block mb-1">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};

// Activity icon based on action type
const ActivityIcon = ({ action }: { action: string }) => {
  if (action.includes('Created')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    );
  } 
  if (action.includes('Edited')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  }
  if (action.includes('Approved')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

// Additional icons
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

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
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

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
