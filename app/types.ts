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