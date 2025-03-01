'use client'; // Mark as Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Editor from '@/app/components/editor/Editor'; // Adjust path if needed
import Link from 'next/link'; // Import Link
import { TiptapContent } from '@/app/types'; // Import TiptapContent type



const EditPostPage = () => {
    const router = useRouter();
    const params = useParams(); // Get route parameters
    const postId = params.id as string; // Access the post ID from params

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState<TiptapContent | null>(null); // State for editor content
    const [loadingPost, setLoadingPost] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [loadingUpdate, setLoadingUpdate] = useState(false);
    // const [updateError, setUpdateError] = useState<string | null>(null);
    const [status, setStatus] = useState<'draft' | 'published'>('draft'); // Add status state, default to 'draft'
    const [scheduledPublishAt, setScheduledPublishAt] = useState<string | null>(null); // State for scheduled publish date/time



    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                setLoadingPost(true);
                setError(null);
                try {
                    const response = await fetch(`/api/posts/${postId}`); // Fetch single post by ID
                    if (!response.ok) {
                        throw new Error(`Failed to fetch post: ${response.status}`);
                    }
                    const postData = await response.json();
                    const post = postData.post; // Assuming API returns { post: { ... } }
                    if (post) {
                        setTitle(post.title || '');
                        setDescription(post.description || '');
                        setCategory(post.category || '');
                        setTags(post.tags ? post.tags.join(', ') : ''); // Convert array to comma-separated string
                        setContent((post.content) || null); // Parse JSON content back to object
                        setStatus(post.status || 'draft'); // Initialize status state from fetched post data, default to 'draft'  <--- ADDED this line
                        setScheduledPublishAt(post.scheduled_publish_at || null);

                    } else {
                        setError('Post not found.');
                    }
                } catch (e: unknown) {
                    console.error('Error fetching post:', e);
                    setError('Failed to load post for editing.');
                } finally {
                    setLoadingPost(false);
                }
            };
            fetchPost();
        }
    }, [postId]); // Fetch post when postId changes


// Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!postId) return;

  try {
    // Convert tags to comma-separated string for API
    const tagsToSend = tags.split(',').map(tag => tag.trim()).join(',');
    
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        category,
        tags: tagsToSend,
        content,
        status,
        scheduled_publish_at: scheduledPublishAt,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update post');
    }

    router.push('/admin/manage-posts');
    alert('Post updated successfully!');
    
  } catch (error: unknown) {
    console.error('Update error:', error);
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('An unknown error occurred.');
    }
  } finally {
    // setLoadingUpdate(false);
  }
};


    if (loadingPost) {
        return <div>Loading post data for editing...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Blog Post</h1>
                </div>
            </header>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                <input type="text" id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>

                            {/* --- Status Dropdown - ADDED --- */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="scheduledPublishAt" className="block text-sm font-medium text-gray-700">Schedule Publish Date/Time (Optional)</label>
                                <input
                                    type="datetime-local"
                                    id="scheduledPublishAt"
                                    value={scheduledPublishAt || ''} // Control the value, handle null
                                    onChange={(e) => setScheduledPublishAt(e.target.value === '' ? null : e.target.value)} // Handle clearing the date
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <p className="text-sm text-gray-500 mt-1">Leave blank for immediate publish when status is set to &quot;Published&quot;.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <Editor setContent={setContent} initialContent={content} /> {/* Pass initialContent prop */}
                            </div>


                            <div className="flex justify-end">
                                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Update Post
                                </button>
                                <Link href="/admin/manage-posts" className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPostPage;