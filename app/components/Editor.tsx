'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import OrderedList from '@tiptap/extension-ordered-list';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Strikethrough,
  Underline as UnderlineIcon,
  FileVideo,
} from 'lucide-react';

const lowlight = createLowlight({});

// Global styles - with mobile optimizations
const globalStyles = `
.ProseMirror {
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    width: 100%;
  }
  td, th {
    border: 1px solid #ced4da;
    padding: 8px;
    min-width: 40px; /* Reduced min-width for mobile */
    position: relative;
    vertical-align: top;
    font-size: 0.9rem; /* Slightly smaller font in tables on mobile */
  }
  th {
    background-color: #f8f9fa;
  }
  .code-block {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.8rem; /* Reduced padding for mobile */
    border-radius: 0.5rem;
    margin: 0.8rem 0; /* Reduced margin for mobile */
    font-size: 0.9rem; /* Slightly smaller code font on mobile */
    overflow-x: auto; /* Enable horizontal scroll for long code lines */
  }
  blockquote {
    border-left: 3px solid #0d0d0d;
    margin-left: 0;
    padding-left: 0.8rem; /* Reduced padding for mobile */
    padding-right: 0;
    font-style: italic;
    position: relative;
    box-sizing: border-box;
  }

  blockquote p {
    position: relative;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
  }

  p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

}

/* Mobile-specific styles using media queries */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%; /* Full width on mobile */
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .bg-white.border.border-gray-200.rounded-t-lg.p-2.flex.flex-wrap.gap-2 {
    padding: 0.5rem; /* Reduced toolbar padding on mobile */
    flex-direction: row; /* Keep buttons in a row, let it wrap */
    flex-wrap: wrap; /* Allow toolbar buttons to wrap */
    overflow-x: auto; /* Enable horizontal scroll if toolbar overflows */
    -webkit-overflow-scrolling: touch; /* Enable smooth horizontal scroll on iOS */
    border-radius: 0; /* No rounded top corners on mobile - full width look */
    border-left: none; /* Remove left border on mobile for full width toolbar */
    border-right: none; /* Remove right border on mobile for full width toolbar */
  }

  .p-2.hover\:bg-gray-100.rounded {
    padding: 0.75rem; /* Slightly larger padding for touch targets on mobile */
    border-radius: 0.25rem; /* Smaller button rounding on mobile */
    font-size: 0.9rem; /* Slightly smaller font in buttons on mobile if text were present */
    margin: 2px; /* Add small margin between buttons for better touch separation */
  }

  .flex.flex-wrap.gap-2.border-r.border-gray-200.pr-2 {
    border-right: none; /* Remove border between button groups on mobile for cleaner look */
    padding-right: 0; /* Remove padding on button groups on mobile */
    margin-bottom: 0.5rem; /* Add some margin below button groups on mobile to separate rows */
  }


  .border.border-gray-200.rounded-b-lg.p-4.min-h-\[300px\].max-h-\[400px\].overflow-y-auto {
    border-radius: 0; /* No rounded bottom corners on mobile - full width look */
    padding: 1rem; /* Adjust editor padding on mobile */
    min-height: 250px; /* Further reduce min-height on very small screens if needed */
    max-height: none; /* Let editor height adjust to content on mobile (optional, remove max-height restriction) */
    border-left: none; /* Remove left border on mobile for full width editor */
    border-right: none; /* Remove right border on mobile for full width editor */
  }

  .absolute.mt-2.p-2.bg-gray-50.rounded-lg.shadow-md {
    position: fixed; /* Fix table dialog position on mobile */
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 0;
    border-radius: 0; /* No rounded corners for bottom dialog */
    width: 100%;
    box-shadow: none; /* Remove shadow for bottom dialog */
    padding: 1rem;
    z-index: 10; /* Ensure it's on top of other content */
  }
}
`;

const Editor = () => {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
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
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc',
      },
    },
  });

  useEffect(() => {
    const currentEditorRef = editorRef.current;
    const handleDblClick = (event: MouseEvent) => {
      if (!editor || currentEditorRef) return;


      const pos = editor.view.posAtCoords({ left: event.clientX, top: event.clientY });
      if (pos && pos.inside !== null) {
        editor.commands.setTextSelection(pos.inside);
      }
    };

    if (currentEditorRef) {
      currentEditorRef.addEventListener('dblclick', handleDblClick);
    }

    return () => {
      if (currentEditorRef) {
        currentEditorRef.removeEventListener('dblclick', handleDblClick);
      }
    };
  }, [editor]);

  const insertTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: Number(rows), cols: Number(cols), withHeaderRow: true })
        .run();
      setShowTableDialog(false);
    }
  };

  const insertVideo = () => {
    const url = window.prompt('Enter video URL:');
    if (url) {
      editor?.chain().focus().insertContent(`<div class="video-placeholder">Video Placeholder: <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>`).run();
    }
  };

  const buttonClass = (active: boolean): string =>
    `p-2 hover:bg-gray-100 rounded ${active ? 'bg-gray-200' : ''}`;

  return (
    <div>
      {/* Apply global styles */}
      <style>{globalStyles}</style>

      <div className="max-w-4xl mx-auto p-4">
        {/* Fixed Toolbar */}
        <div ref={toolbarRef} className="bg-white border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={buttonClass(Boolean(editor?.isActive('bold')))}
              title="Bold"
            >
              <Bold size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={buttonClass(Boolean(editor?.isActive('italic')))}
              title="Italic"
            >
              <Italic size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={buttonClass(Boolean(editor?.isActive('underline')))}
              title="Underline"
            >
              <UnderlineIcon size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={buttonClass(Boolean(editor?.isActive('strike')))}
              title="Strikethrough"
            >
              <Strikethrough size={24} /> {/* Increased icon size for touch */}
            </button>
          </div>

          {/* Headings */}
          <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={buttonClass(Boolean(editor?.isActive('heading', { level: 1 })))}
              title="Heading 1"
            >
              <Heading1 size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={buttonClass(Boolean(editor?.isActive('heading', { level: 2 })))}
              title="Heading 2"
            >
              <Heading2 size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={buttonClass(Boolean(editor?.isActive('heading', { level: 3 })))}
              title="Heading 3"
            >
              <Heading3 size={24} /> {/* Increased icon size for touch */}
            </button>
          </div>

          {/* Blocks & Lists */}
          <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={buttonClass(Boolean(editor?.isActive('bulletList')))}
              title="Bullet List"
            >
              <List size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={buttonClass(Boolean(editor?.isActive('orderedList')))}
              title="Ordered List"
            >
              <ListOrdered size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={buttonClass(Boolean(editor?.isActive('blockquote')))}
              title="Quote"
            >
              <Quote size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={buttonClass(Boolean(editor?.isActive('codeBlock')))}
              title="Code Block"
            >
              <Code size={24} /> {/* Increased icon size for touch */}
            </button>
          </div>

          {/* Alignment */}
          <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
            <button
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={buttonClass(Boolean(editor?.isActive({ textAlign: 'left' })))}
              title="Align Left"
            >
              <AlignLeft size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={buttonClass(Boolean(editor?.isActive({ textAlign: 'center' })))}
              title="Align Center"
            >
              <AlignCenter size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={buttonClass(Boolean(editor?.isActive({ textAlign: 'right' })))}
              title="Align Right"
            >
              <AlignRight size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
              className={buttonClass(Boolean(editor?.isActive({ textAlign: 'justify' })))}
              title="Align Justify"
            >
              <AlignJustify size={24} /> {/* Increased icon size for touch */}
            </button>
          </div>

          {/* Media & Tools */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTableDialog(true)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Insert Table"
            >
              <TableIcon size={24} /> {/* Increased icon size for touch */}
            </button>
            {editor?.isActive('table') && (
              <button
                onClick={() => editor?.chain().focus().deleteTable().run()}
                className="p-2 hover:bg-gray-100 rounded"
                title="Delete Table"
              >
                <Minus size={24} /> {/* Increased icon size for touch */}
              </button>
            )}
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className={buttonClass(Boolean(editor?.isActive('horizontalRule')))}
              title="Horizontal Rule"
            >
              <Minus size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={insertVideo}
              className={buttonClass(false)}
              title="Insert Video"
            >
              <FileVideo size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => {
                const url = window.prompt('Enter image URL:');
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run();
                }
              }}
              className={buttonClass(false)}
              title="Insert Image"
            >
              <ImageIcon size={24} /> {/* Increased icon size for touch */}
            </button>
            <button
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor?.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={buttonClass(Boolean(editor?.isActive('link')))}
              title="Insert Link"
            >
              <LinkIcon size={24} /> {/* Increased icon size for touch */}
            </button>
          </div>

          {/* Table Creation Dialog */}
          {showTableDialog && (
            <div className="absolute mt-2 p-2 bg-gray-50 rounded-lg shadow-md">
              <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <div>
                    <label className="text-sm">Rows</label>
                    <input
                      type="number"
                      value={rows}
                      onChange={(e) =>
                        setRows(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Columns</label>
                    <input
                      type="number"
                      value={cols}
                      onChange={(e) =>
                        setCols(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </div>
                </div>
                <button
                  onClick={insertTable}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Insert Table
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editor Content */}
        <div
          ref={editorRef}
          className="border border-gray-200 rounded-b-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto"
        >
          <style>{`
            .ProseMirror {
              min-height: 200px;
              padding-bottom: 1rem;
            }

            .ProseMirror:focus {
              outline: none;
            }

            .ProseMirror > *:last-child {
              margin-bottom: 1rem;
            }

            .video-placeholder {
              background-color: #f0f0f0;
              border: 1px dashed #ccc;
              padding: 10px;
              text-align: center;
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Editor;