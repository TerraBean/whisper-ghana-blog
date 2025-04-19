// app/components/PostContent.tsx
'use client';

import React, { useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import DOMPurify from 'isomorphic-dompurify'; // Replace with isomorphic version
import { StarterKit } from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { createLowlight } from 'lowlight';
import { TiptapContent } from '../types';

const lowlight = createLowlight({});

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    blockquote: { HTMLAttributes: { class: 'blockquote' } },
  }),
  TiptapLink.configure({ 
    openOnClick: false, 
    HTMLAttributes: { 
      rel: 'noopener noreferrer', 
      target: '_blank',
      class: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-1 underline-offset-2'
    } 
  }),
  TiptapImage.configure({ inline: true, allowBase64: true }),
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  CodeBlockLowlight.configure({ 
    lowlight,
    HTMLAttributes: {
      class: 'bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm my-4 overflow-x-auto',
    }
  }),
  Table.configure({ 
    resizable: true, 
    HTMLAttributes: { 
      class: 'border-collapse table-auto w-full my-4 text-sm' 
    }, 
    allowTableNodeSelection: true 
  }),
  TableRow,
  TableCell.configure({
    HTMLAttributes: {
      class: 'border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200',
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: 'border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-white',
    },
  }),
  Placeholder.configure({ placeholder: 'Start typing...' }),
];

interface PostContentProps {
  content: TiptapContent;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const processedHtml = useMemo(() => {
    if (!content || !content.type || !Array.isArray(content.content)) {
      return '<div class="text-gray-600 dark:text-gray-400">No content available.</div>';
    }

    const rawHtml = generateHTML(content, extensions);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml); // Now works on server and client
    
    // Enhance image display
    return sanitizedHtml.replace(
      /<img src="([^"]+)" alt="([^"]*)"\/?>/g,
      (_, src, alt) => `
        <figure class="relative w-full my-6">
          <img 
            src="${src}" 
            alt="${alt}" 
            class="object-cover rounded-lg w-full max-h-[500px] shadow-md dark:shadow-gray-900/30"
          />
          ${alt ? `<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 italic">${alt}</figcaption>` : ''}
        </figure>
      `
    );
  }, [content]);

  return (
    <article 
      className={`prose prose-lg max-w-none text-content dark:prose-invert 
                 prose-headings:text-gray-900 dark:prose-headings:text-white
                 prose-p:text-gray-800 dark:prose-p:text-gray-200
                 prose-strong:text-gray-900 dark:prose-strong:text-white
                 prose-li:text-gray-800 dark:prose-li:text-gray-200
                 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-700 hover:dark:prose-a:text-indigo-300
                 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-4
                 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                 `}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};

export default PostContent;