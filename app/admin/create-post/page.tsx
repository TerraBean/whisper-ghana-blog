'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/app/components/editor/Editor';
import Link from 'next/link';
import { Button, Input, Select, TextArea } from '@/components/ui';
import { createPost } from '@/services';
import { TiptapContent } from '@/types';
import { usePostForm } from '@/hooks';

const CreatePostPage = () => {
  const router = useRouter();

  // Handle form submission
  const handleSubmitForm = async (formData: any) => {
    const result = await createPost({
      title: formData.title,
      description: formData.description,
      category: formData.category, // Fixed: Changed from category_id to category
      tags: formData.tags,
      content: formData.content || { type: 'doc', content: [] },
      status: formData.status,
      scheduled_publish_at: formData.scheduledPublishAt,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create post');
    }

    router.push('/admin/manage-posts');
    alert('Post created successfully!');
  };

  // Use our custom hook
  const {
    title,
    description,
    category,
    tags,
    content,
    status,
    scheduledPublishAt,
    errors,
    isSubmitting,
    submitError,
    categoryOptions,
    statusOptions,
    handleChange,
    setContent,
    handleSubmit,
  } = usePostForm({
    onSubmit: handleSubmitForm,
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 ease-in-out">
      <div className="flex flex-col gap-6">
        {/* Header with breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
            <p className="text-sm text-gray-500 mt-1">Create engaging content for your audience</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Link href="/admin/manage-posts">
              <span className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline cursor-pointer flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back to Posts
              </span>
            </Link>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-xl overflow-hidden transition-all border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Top form section */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Input
                    label="Title"
                    value={title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                    className="text-lg font-medium px-4 py-3 border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
                    placeholder="Enter an engaging title..."
                  />

                  <TextArea
                    label="Description"
                    value={description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
                    placeholder="Write a brief description of your post..."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={category}
                      onChange={(value) => handleChange('category', value)}
                      error={errors.category}
                      required
                      className="border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
                    />

                    <Input
                      label="Tags (comma-separated)"
                      value={tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      className="border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
                      placeholder="tech, news, tutorial"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={status}
                      onChange={(value) => handleChange('status', value)}
                      className="border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm"
                    />

                    <Input
                      label="Schedule Publish Date/Time"
                      type="datetime-local"
                      value={scheduledPublishAt || ''}
                      onChange={(e) => handleChange('scheduledPublishAt', e.target.value === '' ? null : e.target.value)}
                      disabled={status === 'draft'}
                      className={`border-0 ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 shadow-sm ${status === 'draft' ? 'opacity-50' : ''}`}
                    />
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-gray-700/50 rounded-lg p-4 border border-indigo-100 dark:border-gray-600">
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-300 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      Publishing Options
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {status === 'draft' ? 
                        'Your post will be saved as a draft and won\'t be visible to readers.' : 
                        scheduledPublishAt ? 
                          `Your post will be published automatically on ${new Date(scheduledPublishAt).toLocaleString()}.` : 
                          'Your post will be published immediately upon submission.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content editor section */}
            <div className="p-6 sm:p-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Editor 
                    setContent={setContent} 
                    initialContent={content as TiptapContent | null} 
                  />
                </div>
                
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              </div>
            </div>

            {/* Form actions */}
            <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="px-6 py-2.5 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      {status === 'published' ? 'Publish Post' : 'Save Draft'}
                    </span>
                  </Button>
                  
                  <Link href="/admin/manage-posts" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      type="button"
                      className="px-6 py-2.5 w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-gray-500 italic">
                  {status === 'draft' ? 'You can publish this later' : 'Ready to share with the world?'}
                </p>
              </div>
              
              {submitError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                  <p className="text-red-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {submitError}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
