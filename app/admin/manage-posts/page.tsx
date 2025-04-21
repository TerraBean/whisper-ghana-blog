'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Select } from '@/components/ui';
import { Post } from '@/types';

const ManagePostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6; // Changed to exactly 6 posts per page as requested
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL('/api/posts', window.location.origin);
        if (statusFilter !== 'all') {
          url.searchParams.append('status', statusFilter);
        }
        
        // Add pagination parameters
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', postsPerPage.toString());
        
        // Add search query if present
        if (searchQuery.trim()) {
          url.searchParams.append('search', searchQuery.trim());
          setIsSearching(true);
        } else {
          setIsSearching(false);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched posts:', data);
        setPosts(data.posts || []);
        
        // Set pagination data if available from API
        if (data.pagination) {
          setTotalPosts(data.pagination.total || 0);
          setTotalPages(data.pagination.totalPages || 1);
        } else {
          // Fallback if API doesn't provide pagination info
          setTotalPosts(data.posts?.length || 0);
          setTotalPages(Math.ceil((data.posts?.length || 0) / postsPerPage));
        }
      } catch (e: unknown) {
        console.error('Error fetching posts:', e);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [statusFilter, currentPage, searchQuery]);

  const handleDeletePost = async (postIdToDelete: string) => {
    const postToDelete = posts.find(p => p.id === postIdToDelete);

    if (!window.confirm(`Are you sure you want to delete the post "${postToDelete?.title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postIdToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postIdToDelete));
        alert('Post deleted successfully!');
        
        // Recalculate pagination if necessary
        if (posts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refresh the current page
          const fetchUrl = new URL('/api/posts', window.location.origin);
          if (statusFilter !== 'all') {
            fetchUrl.searchParams.append('status', statusFilter);
          }
          fetchUrl.searchParams.append('page', currentPage.toString());
          fetchUrl.searchParams.append('limit', postsPerPage.toString());
          
          const refreshResponse = await fetch(fetchUrl.toString());
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setPosts(refreshData.posts || []);
            
            if (refreshData.pagination) {
              setTotalPosts(refreshData.pagination.total || 0);
              setTotalPages(refreshData.pagination.totalPages || 1);
            }
          }
        }
      } else {
        const errorData = await response.json();
        setError(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
        alert(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during post deletion:', error);
      setError('Error deleting post. Please check the console.');
      alert('Error deleting post. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'published', label: 'Published Only' },
    { value: 'draft', label: 'Drafts Only' },
  ];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const badgeClasses = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-indigo-100 text-indigo-800',
      scheduled: 'bg-purple-100 text-purple-800',
    };

    const statusLabel = {
      published: 'Published',
      draft: 'Draft',
      scheduled: 'Scheduled',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabel[status as keyof typeof statusLabel] || status}
      </span>
    );
  };

  const PostCard = ({ post }: { post: Post }) => {
    return (
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-4 transition-shadow hover:shadow-md">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-2">{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Author:</span> {post.author_name || post.author || 'Anonymous'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Category:</span> {post.category || post.categoryName || 'Uncategorized'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-200">Published:</span> {
            post.published_at
              ? format(new Date(post.published_at), 'MMM d, yyyy')
              : post.scheduled_publish_at
                ? `Scheduled: ${format(new Date(post.scheduled_publish_at), 'MMM d, yyyy')}`
                : 'Not published'
          }</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-600">
          <Link href={`/blog/${post.id}`} target="_blank" className="flex-1">
            <Button variant="outline" className="w-full text-xs py-1 text-indigo-700 border-indigo-300 hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/30">
              View
            </Button>
          </Link>
          <Link href={`/admin/edit-post/${post.id}`} className="flex-1">
            <Button variant="secondary" className="w-full text-xs py-1">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            className="flex-1 text-xs py-1"
            onClick={() => handleDeletePost(post.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const pageButtons = [];
    const maxVisiblePages = 3; // Reduced from 5 to 3 for cleaner UI
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    // First page button if not visible
    if (startPage > 1) {
      pageButtons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
            ...
          </span>
        );
      }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            currentPage === i 
              ? 'bg-indigo-600 text-white border-indigo-600 dark:border-indigo-500 hover:bg-indigo-700' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
          } text-sm font-medium`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Last page button if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
            ...
          </span>
        );
      }
      
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    return (
      <nav className="flex items-center justify-between mt-6 py-3 border-t border-gray-200 dark:border-gray-600" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{posts.length > 0 ? (currentPage - 1) * postsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * postsPerPage, totalPosts)}</span> of <span className="font-medium">{totalPosts}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-center sm:justify-end">
          <div className="inline-flex shadow-sm">
            {pageButtons}
          </div>
        </div>
      </nav>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Blog Posts</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex justify-center">
          <div className="animate-pulse text-lg py-12">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Blog Posts</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">List of Blog Posts</h2>
                <Link href="/admin/create-post">
                  <Button variant="primary" className="whitespace-nowrap">
                    Create New Post
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                {/* Search form with improved alignment */}
                <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-1">
                  <div className="relative flex-grow flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') {
                          setCurrentPage(1);
                        }
                      }}
                      placeholder="Search posts..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      aria-label="Search posts"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute inset-y-0 right-12 pr-1 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        aria-label="Clear search"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      onClick={() => setCurrentPage(1)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      aria-label="Submit search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Filter dropdown with improved contrast */}
                <div className="w-full sm:w-44">
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 p-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md">
                <p className="text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <span>
                    <span className="font-medium">Search results for:</span> "{searchQuery}"
                  </span>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 text-sm font-medium"
                  >
                    Clear search
                  </button>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-4">No posts available with the selected filter.</p>
                <Link href="/admin/create-post">
                  <Button variant="primary">Create your first post</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="md:hidden">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">Published Date</th>
                        <th scope="col" className="relative px-6 py-3 w-1/6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-0">
                            <div className="truncate" title={post.title}>
                              {post.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-0">
                            <div className="truncate" title={post.author_name || post.author || 'Anonymous'}>
                              {post.author_name || post.author || 'Anonymous'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-0">
                            <div className="truncate" title={post.category || post.categoryName || 'Uncategorized'}>
                              {post.category || post.categoryName || 'Uncategorized'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <StatusBadge status={post.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {post.published_at
                              ? format(new Date(post.published_at), 'MMM d, yyyy')
                              : post.scheduled_publish_at
                                ? `Scheduled: ${format(new Date(post.scheduled_publish_at), 'MMM d, yyyy')}`
                                : 'Not published'}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/blog/${post.id}`} target="_blank">
                                <Button variant="outline" className="text-xs px-2 py-1 text-indigo-700 border-indigo-300 hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/30">
                                  View
                                </Button>
                              </Link>
                              <Link href={`/admin/edit-post/${post.id}`}>
                                <Button variant="secondary" className="text-xs px-2 py-1">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="danger"
                                className="text-xs px-2 py-1"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Pagination />
              </>
            )}
      </div>
    </div>
  );
};

export default ManagePostsPage;
