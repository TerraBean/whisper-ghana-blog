'use client'; // Mark as Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/app/components/editor/Editor';
import Link from 'next/link'; // Import Link
import { TiptapContent } from '@/app/types';

const CreatePostPage = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState<TiptapContent | null>(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'draft' | 'published'>('draft'); // Add status state, default to 'draft'
    const [scheduledPublishAt, setScheduledPublishAt] = useState<string | null>(null); // State for scheduled publish date/time



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    tags,
                    content,
                    status,
                    scheduled_publish_at: scheduledPublishAt || null, // Send null explicitly if not set
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create post: ${response.status}`);
            }

            const newPost = await response.json();
            console.log('Post created successfully:', newPost);
            alert('Post created successfully!');
            router.push('/admin/manage-posts'); // Redirect to manage posts page

        } catch (e: unknown) {
            console.error('Error creating post:', e);
            setError(e instanceof Error ? e.message : 'Failed to create new post.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>


                {/* --- Status Dropdown - ADDED --- */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                {/* --- Scheduled Publish Date/Time Picker - ADDED --- */}
                <div>
                    <label htmlFor="scheduledPublishAt" className="block text-sm font-medium text-gray-700">Schedule Publish Date/Time (Optional)</label>
                    <input
                        type="datetime-local"
                        id="scheduledPublishAt"
                        value={scheduledPublishAt || ''}
                        onChange={(e) => setScheduledPublishAt(e.target.value === '' ? null : e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={status === 'draft'} // Disable for drafts
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave blank for immediate publish when status is set to &quot;Published&quot;.</p>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <Editor setContent={setContent} initialContent={null as TiptapContent | null} /> {/* No initial content for create */}
                </div>

                <div>
                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                    <Link href="/admin/manage-posts" className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;