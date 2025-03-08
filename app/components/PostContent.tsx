// app/components/PostContent.tsx

'use client';

import React from 'react';
import { generateHTML } from '@tiptap/html';
import Image from 'next/image'; // Import Next.js Image component
import DOMPurify from 'dompurify'; // For sanitizing HTML
import {
  StarterKit,
} from '@tiptap/starter-kit'; // Only include extensions bundled in starter-kit
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import { createLowlight } from 'lowlight';
import { TiptapContent } from '../types';

const lowlight = createLowlight({});

interface PostContentProps {
  content: TiptapContent;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  // Validate content
  if (!content || !content.type || !Array.isArray(content.content)) {
    return <div className="text-gray-600">No content available.</div>;
  }

  // Generate HTML from Tiptap content
  const rawHtml = generateHTML(content, [
    StarterKit.configure({
      codeBlock: false,
      blockquote: { HTMLAttributes: { class: 'blockquote' } },
    }),
    BulletList,
    ListItem,
    TiptapLink.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    TiptapImage.configure({
      inline: true,
      allowBase64: true,
    }),
    Strike,
    Underline,
    OrderedList,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({ lowlight }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: 'table' },
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    HorizontalRule,
    Placeholder.configure({ placeholder: 'Start typing...' }),
  ]);

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);

  // Replace <img> tags with Next.js Image component
  const processedHtml = sanitizedHtml.replace(
    /<img src="([^"]+)" alt="([^"]*)"\/?>/g,
    (_, src, alt) => `
      <figure class="relative w-full h-64 my-4">
        <Image
          src="${src}"
          alt="${alt}"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-lg"
        />
      </figure>
    `
  );

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};

export default PostContent;