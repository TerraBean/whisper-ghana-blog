'use client';

import React from 'react';
import { generateHTML } from '@tiptap/html';
import { StarterKit } from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Placeholder from '@tiptap/extension-placeholder'


import { TiptapContent } from '../types';

const lowlight = createLowlight({});
interface PostContentProps {
  content: TiptapContent;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const html = generateHTML(content, [
    StarterKit.configure({
      codeBlock: false,
      blockquote: { HTMLAttributes: { class: 'blockquote' } },
    }),
    BulletList,
    ListItem,
    Link,
    Image,
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
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
  ]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default PostContent;