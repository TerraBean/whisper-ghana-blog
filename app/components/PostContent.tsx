// components/PostContent.tsx

'use client'; // Mark this component as a Client Component

import React from 'react';
import { EditorContent } from '@tiptap/react';

interface PostContentProps {
  content: any; // Type as needed, or 'any' for flexibility with Tiptap JSON
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <EditorContent editor={null} content={content} />
  );
};

export default PostContent;