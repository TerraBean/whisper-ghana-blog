// Types for Tiptap editor content
export interface TiptapContent {
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