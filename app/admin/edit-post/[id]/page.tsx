'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '@/app/components/editor/Editor';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { getPostById, updatePost } from '@/services';
import { TiptapContent } from '@/types';
import { usePostForm } from '@/hooks';

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [initialValues, setInitialValues] = useState<any>({});
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch post data for editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      setLoadingPost(true);
      
      try {
        const post = await getPostById(postId);
        console.log("Fetched post:", post); // Debug log to see what's coming from API
        
        if (!post) {
          setLoadError('Post not found.');
          return;
        }
        
        // Ensure content is properly formatted as TiptapContent
        let formattedContent = post.content;
        
        // If content is a string (JSON string), parse it
        if (typeof post.content === 'string') {
          try {
            formattedContent = JSON.parse(post.content);
          } catch (e) {
            console.error("Failed to parse post content:", e);
            formattedContent = null;
          }
        }
        
        // Ensure the content has a type property if it exists
        if (formattedContent && !formattedContent.type) {
          formattedContent.type = 'doc';
        }
        
        // Prepare initial values for the form
        setInitialValues({
          title: post.title || '',
          description: post.description || '',
          category: post.category || post.categoryName || '',
          tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '',
          content: formattedContent,
          status: post.status || 'draft',
          scheduledPublishAt: post.scheduled_publish_at || null,
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoadError('Failed to load post data for editing.');
      } finally {
        setLoadingPost(false);
      }
    };
    
    fetchPost();
  }, [postId]);

  // Handle form submission
  const handleSubmitForm = async (formData: any) => {
    if (!postId) throw new Error('Post ID is missing');
    
    const tagsArray = formData.tags.split(',').map((tag: string) => tag.trim());
    
    const result = await updatePost(postId, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: tagsArray.join(','),
      content: formData.content,
      status: formData.status,
      scheduled_publish_at: formData.scheduledPublishAt,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to update post');
    }

    router.push('/admin/manage-posts');
    alert('Post updated successfully!');
  };

  // Use our custom form hook (only after initial data is loaded)
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
    initialValues,
    onSubmit: handleSubmitForm,
  });

  // Show loading state
  if (loadingPost) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg">Loading post data...</div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{loadError}</div>
      </div>
    );
  }

  // Log the content being passed to Editor for debugging
  console.log("Content being passed to Editor:", content);

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
            {/* Form content - replaced with usePostForm components */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text"
                  id="title" 
                  value={title} 
                  onChange={(e) => handleChange('title', e.target.value)} 
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} sm:text-sm`}
                  required 
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Description Textarea */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => handleChange('description', e.target.value)} 
                  rows={3} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Category Select */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  id="category" 
                  value={category} 
                  onChange={(e) => handleChange('category', e.target.value)} 
                  className={`mt-1 block w-full rounded-md shadow-sm ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} sm:text-sm`}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
              
              {/* Tags Input */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input 
                  type="text"
                  id="tags" 
                  value={tags} 
                  onChange={(e) => handleChange('tags', e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Status Select */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => handleChange('status', e.target.value as any)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Scheduled Publish Date */}
              <div>
                <label htmlFor="scheduledPublishAt" className="block text-sm font-medium text-gray-700">Schedule Publish Date/Time (Optional)</label>
                <input 
                  type="datetime-local" 
                  id="scheduledPublishAt"
                  value={scheduledPublishAt || ''} 
                  onChange={(e) => handleChange('scheduledPublishAt', e.target.value === '' ? null : e.target.value)} 
                  disabled={status === 'draft'} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank for immediate publish when status is set to &quot;Published&quot;.</p>
              </div>
              
              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <Editor 
                  setContent={setContent} 
                  initialContent={content as TiptapContent | null} 
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                >
                  Update Post
                </Button>
                <Link href="/admin/manage-posts">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
              
              {/* Display submission error if any */}
              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;