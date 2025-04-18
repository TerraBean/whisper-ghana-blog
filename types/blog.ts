import { TiptapContent } from './editor';

// Blog post status type
export type PostStatus = 'draft' | 'published';

// Core post data structure
export interface Post {
  id: string;
  title: string;
  description: string | null;
  content: TiptapContent;
  minutes_to_read: number;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  status: PostStatus;
  scheduled_publish_at: string | null;
  is_featured: boolean;
  author_id: string | null;
  category_id: string | null;
  category?: string; // From API response
  categoryName?: string; // Alternative name
  author?: string; // For author name
  author_name?: string; // From API response
}

// Request schema for creating posts
export interface CreatePostRequest {
  title: string;
  description: string | null;
  category_id: string;
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