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
      category: formData.category,
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
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          value={title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <TextArea
          label="Description"
          value={description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(value) => handleChange('category', value)}
          error={errors.category}
          required
        />

        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(value) => handleChange('status', value)}
        />

        <Input
          label="Schedule Publish Date/Time (Optional)"
          type="datetime-local"
          value={scheduledPublishAt || ''}
          onChange={(e) => handleChange('scheduledPublishAt', e.target.value === '' ? null : e.target.value)}
          disabled={status === 'draft'}
        />
        <p className="text-sm text-gray-500 -mt-4">Leave blank for immediate publish when status is set to &quot;Published&quot;.</p>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <Editor 
            setContent={setContent} 
            initialContent={content as TiptapContent | null} 
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <Button type="submit" isLoading={isSubmitting}>
            Create Post
          </Button>
          <Link href="/admin/manage-posts">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
        
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePostPage;