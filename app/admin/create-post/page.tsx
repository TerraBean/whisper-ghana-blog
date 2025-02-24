// app/admin/create-post/page.tsx

'use client'; // Mark as a client component because we'll use useState and Tiptap editor

import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // For dynamic import of Tiptap editor
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is included (if needed in this component)

// Dynamically import the Tiptap editor component (assuming you have it, adjust path if needed)
const Editor = dynamic(() => import('@/app/components/editor/Editor'), {
    ssr: false, // Prevent server-side rendering of the editor
});

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState(''); // Simple string for now, can be array later
  const [content, setContent] = useState(null); // State to hold editor content (JSON)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
        }),
      });
  
      if (response.ok) {
        // Post creation successful
        console.log('Post created successfully!');
        // Optionally, you can redirect the user to the dashboard or a success page
        // For now, let's just clear the form
        setTitle('');
        setDescription('');
        setCategory('');
        setTags('');
        setContent(null); // Clear editor content
        alert('Post created successfully!'); // Simple success alert
      } else {
        // Post creation failed
        const errorData = await response.json(); // Try to get error details from API
        console.error('Failed to create post:', errorData);
        alert(`Failed to create post: ${errorData.error || 'Unknown error'}`); // Simple error alert
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('Error submitting form. Please check the console.'); // Generic error alert
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Blog Post</h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="category"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="tags"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="mt-1">
                  {/* Render the Tiptap Editor here */}
                  <div className="border rounded-md shadow-sm">
                    <Editor setContent={setContent} /> {/* Pass setContent to Editor */}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;