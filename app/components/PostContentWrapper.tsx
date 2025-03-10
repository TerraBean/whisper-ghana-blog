// app/components/PostContentWrapper.tsx
'use client';

import React, { Suspense } from 'react';
import PostContent from './PostContent';
import { TiptapContent } from '../types';

interface PostContentWrapperProps {
  content: TiptapContent;
}

const PostContentWrapper: React.FC<PostContentWrapperProps> = ({ content }) => {
  return (
    <Suspense fallback={<div className="text-gray-500">Loading content...</div>}>
      <PostContent content={content} />
    </Suspense>
  );
};

export default PostContentWrapper;