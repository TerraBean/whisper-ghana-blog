// app/blog/[postId]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { PostCardProps } from '@/app/page';
import PostContentWrapper from '@/app/components/PostContentWrapper';
import { generateHTML } from '@tiptap/html';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
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

// Extend PostCardProps to include pre-rendered HTML for build phase
interface StaticPost extends PostCardProps {
  prerenderedContent?: string;
}

interface BlogPostPageProps {
  params: Promise<{ postId: string }>;
}

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

// Mock data with pre-rendered content for builds only
const mockPosts: StaticPost[] = process.env.NEXT_PHASE === 'phase-production-build'
  ? [
      {
        id: 'eb6958c7-2a84-4e50-8142-6ff6cd7a16e4',
        title: 'Test Post',
        description: 'A sample blog post for testing.',
        status: 'published',
        category: 'Test',
        tags: ['test', 'sample'],
        author: 'Test Author',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello, world!' }] }],
        },
        minutesToRead: 5,
        createdAt: '2025-03-01T00:00:00Z',
        published_at: '2025-03-01T00:00:00Z',
        scheduled_publish_at: null,
        prerenderedContent: prerenderContent({
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello, world!' }] }],
        }),
      },
    ]
  : [];

// Pre-render content during build only
function prerenderContent(content: PostCardProps['content']): string {
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('prerenderContent should only run during build phase');
  }
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const rawHtml = generateHTML(content, extensions);
  return purify.sanitize(rawHtml);
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ postId: post.id }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postId } = await params;
  const post = await getPostById(postId) as StaticPost;
  if (!post) notFound();

  const formattedDate = post.published_at
    ? format(parseISO(post.published_at), 'MMM d, yyyy')
    : 'Draft';

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="mb-6 text-gray-600 flex items-center space-x-4">
          <span>Category: {post.category || 'Uncategorized'}</span>
          <span>Published: {formattedDate}</span>
          <span>Author: {post.author || 'Unknown'}</span>
          <span>{post.minutesToRead} min read</span>
        </div>
        <div className="prose max-w-none">
          {isBuildPhase && post.prerenderedContent ? (
            <div dangerouslySetInnerHTML={{ __html: post.prerenderedContent }} />
          ) : (
            <PostContentWrapper content={post.content} />
          )}
        </div>
      </article>
    </div>
  );
}

async function getAllPosts(): Promise<StaticPost[]> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return mockPosts;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache',
    });
    if (!response.ok) {
      console.error(`Failed to fetch posts: HTTP ${response.status} - ${await response.text()}`);
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.posts as StaticPost[];
  } catch (error) {
    console.error('Error in getAllPosts():', error);
    return [];
  }
}

async function getPostById(postId: string): Promise<StaticPost | null> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return mockPosts.find((post) => post.id === postId) || null;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Failed to fetch post ${postId}: HTTP ${response.status} - ${await response.text()}`);
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.post as StaticPost;
  } catch (error) {
    console.error('Error in getPostById():', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getPostById(postId);
  return {
    title: post?.title || 'Post Not Found',
    description: post?.description || 'This post does not exist.',
  };
}