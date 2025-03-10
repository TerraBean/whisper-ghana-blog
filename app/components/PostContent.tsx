// app/components/PostContent.tsx
'use client';

import React, { useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import DOMPurify from 'dompurify';
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
  TiptapLink.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
  TiptapImage.configure({ inline: true, allowBase64: true }),
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  CodeBlockLowlight.configure({ lowlight }),
  Table.configure({ resizable: true, HTMLAttributes: { class: 'table' }, allowTableNodeSelection: true }),
  TableRow,
  TableCell,
  TableHeader,
  Placeholder.configure({ placeholder: 'Start typing...' }),
];

interface PostContentProps {
  content: TiptapContent;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const processedHtml = useMemo(() => {
    if (!content || !content.type || !Array.isArray(content.content)) {
      return '<div class="text-gray-600">No content available.</div>';
    }

    const rawHtml = generateHTML(content, extensions);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return sanitizedHtml.replace(
      /<img src="([^"]+)" alt="([^"]*)"\/?>/g,
      (_, src, alt) => `
        <figure class="relative w-full h-64 my-4">
          <img src="${src}" alt="${alt}" class="object-cover rounded-lg w-full h-full" />
        </figure>
      `
    );
  }, [content]);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};

export default PostContent;