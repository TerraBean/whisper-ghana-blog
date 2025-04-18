import { TiptapContent } from './editor';

// Blog post status type
export type PostStatus = 'draft' | 'published';

// Core post data structure
export interface Post {
  id: string;
  title: string;
  description: string;
  status: PostStatus;
  category: string;
  tags: string[];
  author: string;
  content: TiptapContent;
  minutesToRead: number;
  createdAt: string;
  published_at: string | null;
  scheduled_publish_at: string | null;
}

// Request schema for creating posts
export interface CreatePostRequest {
  title: string;
  description: string;
  category: string;
  tags: string;
  content: TiptapContent;
  status: PostStatus;
  scheduled_publish_at: string | null;
}

// Request schema for updating posts
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id?: string;
}

// Response type for post listings
export interface PostsResponse {
  posts: Post[];
  total: number;
}