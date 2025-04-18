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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct URL with status filter
        const url = new URL('/api/posts', window.location.origin);
        if (statusFilter !== 'all') {
          url.searchParams.append('status', statusFilter);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (e: unknown) {
        console.error('Error fetching posts:', e);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [statusFilter]); 

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
        // Optimistically update frontend state
        setPosts(posts.filter(post => post.id !== postIdToDelete));
        alert('Post deleted successfully!');
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

  // Status filter options for the Select component
  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'published', label: 'Published Only' },
    { value: 'draft', label: 'Drafts Only' },
  ];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const badgeClasses = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'published' ? 'Published' : 'Draft'}
      </span>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Blog Posts</h1>
        </div>
      </header>
      
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-800">List of Blog Posts</h2>
                <Link href="/admin/create-post">
                  <Button variant="primary" className="whitespace-nowrap">
                    Create New Post
                  </Button>
                </Link>
              </div>
              
              <div className="w-full md:w-64">
                <Select
                  label="Filter by Status"
                  options={filterOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-4">No posts available with the selected filter.</p>
                <Link href="/admin/create-post">
                  <Button variant="primary">Create your first post</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.published_at 
                            ? format(new Date(post.published_at), 'MMM d, yyyy')
                            : post.scheduled_publish_at
                              ? `Scheduled: ${format(new Date(post.scheduled_publish_at), 'MMM d, yyyy')}`
                              : 'Not published'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/blog/${post.id}`} target="_blank">
                              <Button variant="outline" className="text-xs px-2 py-1">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePostsPage;