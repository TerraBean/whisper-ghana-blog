// app/types.ts

export interface TiptapContent { // Make sure to export them
    type: string;
    content: TiptapNode[];
  }
  
  export interface TiptapNode {
    type: string;
    content?: TiptapNode[];
    text?: string;
    marks?: TiptapMark[];
    attrs?: Record<string, unknown>; 
  }
  
  export interface TiptapMark {
    type: string;
    attrs?: Record<string, unknown>; 
  }

  export interface PostCardProps {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'published';
    category: string;
    tags: string[];
    author: string;
    content: TiptapContent;
    minutesToRead: number;
    createdAt: string;
    published_at: string | null;
    scheduled_publish_at: string | null;
  }