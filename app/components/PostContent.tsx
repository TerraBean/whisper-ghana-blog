// app/components/PostContent.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { generateHTML } from '@tiptap/html';
import {
  StarterKit,
} from '@tiptap/starter-kit';
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
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    const sanitizeContent = async () => {
      // Generate raw HTML from Tiptap content
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

      // Call the API route to sanitize the HTML
      const response = await fetch('/api/sanitize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: rawHtml }),
      });

      if (response.ok) {
        const { sanitizedHtml } = await response.json();
        setSanitizedContent(sanitizedHtml);
      } else {
        console.error('Failed to sanitize content');
      }
    };

    sanitizeContent();
  }, [content]);

  // Replace <img> tags with Next.js Image component
  const processedHtml = sanitizedContent.replace(
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