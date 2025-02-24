// app/admin/manage-posts/page.tsx

'use client'; // Mark as Client Component for useState, useEffect

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostCardProps } from '@/app/page'; // Import PostCardProps type

const ManagePostsPage = () => {
  const [posts, setPosts] = useState<PostCardProps[]>([]); // State to hold array of posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        const response = await fetch('/api/posts'); // Fetch from /api/posts (GET endpoint)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts || []); // Update state with fetched posts array
        setLoading(false);
      } catch (e: any) { // Type 'e' as 'any' or 'Error'
        console.error('Error fetching posts:', e);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array: fetch posts only once on component mount

  if (loading) {
    return <div>Loading posts...</div>; // Simple loading state
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Display error message
  }

  const handleDeletePost = async (postIdToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete the post "${posts.find(p => p.id === postIdToDelete)?.title}"? This action cannot be undone.`)) {
      return; // User cancelled deletion
    }

    setLoading(true); // Start loading again during deletion
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postIdToDelete}`, {
        method: 'DELETE', // DELETE request to API
      });

      if (response.ok) {
        console.log(`Post ${postIdToDelete} deleted successfully.`);
        alert('Post deleted successfully!');
        // --- Refresh the post list after successful deletion ---
        const updatedPosts = posts.filter(post => post.id !== postIdToDelete); // Optimistically update frontend state
        setPosts(updatedPosts);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete post:', errorData);
        setError(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
        alert(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during post deletion:', error);
      setError('Error deleting post. Please check the console.');
      alert('Error deleting post. Please check the console.');
    } finally {
      setLoading(false); // End loading state
    }
  };
  
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">List of Blog Posts</h2>

            {posts.length === 0 ? (
              <p className="text-gray-700">No posts available yet.</p>
            ) : (
              <div className="overflow-x-auto"> {/* Make table scrollable horizontally */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit/Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category || 'Uncategorized'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/edit-post/${post.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                          <button
                            onClick={() => handleDeletePost(post.id)} // Call handleDeletePost function
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            Delete
                          </button> {/* Placeholder delete action */}
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