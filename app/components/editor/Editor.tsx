// app/components/editor/Editor.tsx

'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { Moon, Sun } from 'lucide-react'; // Icons for theme toggle

import { GLOBAL_STYLES } from './editorStyles';
import Toolbar from './Toolbar';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme Hook
import { TiptapContent } from '@/app/types';

const lowlight = createLowlight({});

// --- Define Props Interface for Editor Component ---
interface EditorProps {
  setContent: React.Dispatch<React.SetStateAction<TiptapContent | null>>; // Define setContent prop type
  initialContent?: TiptapContent | null;
}

const Editor: React.FC<EditorProps> = ({ setContent, initialContent }) => { // Use EditorProps interface and destructure setContent prop
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme(); // Use Theme Context!

  const editor = useEditor({
    immediatelyRender: false,
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
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc',
      },
    },
    // --- Update editor content whenever editor state changes ---
    onUpdate({ editor }) {
      setContent(editor.getJSON()); // Call setContent prop to pass content to parent
    },
    content: initialContent || null, // Set initial content
  });

  // --- Utility functions ---
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!editor || !editorRef.current) return;

    const pos = editor.view.posAtCoords({ left: event.clientX, top: event.clientY });
    if (pos && pos.inside !== null) {
      editor.commands.setTextSelection(pos.inside);
    }
  }, [editor]);

  const handleInsertTable = useCallback(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: Number(rows), cols: Number(cols), withHeaderRow: true })
        .run();
      setShowTableDialog(false);
    }
  }, [editor, rows, cols]);

  const handleInsertVideo = useCallback(() => {
    const url = window.prompt('Enter video URL:');
    if (url) {
      editor?.chain().focus().insertContent(`<div class="video-placeholder">Video Placeholder: <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>`).run();
    }
  }, [editor]);

  const getButtonClass = useCallback((active: boolean): string => {
    return `p-2 hover:bg-gray-100 rounded ${active ? 'bg-gray-200' : ''}`;
  }, []);



  // --- Editor Lifecycle Effects ---
  useEffect(() => {
    const currentEditorRef = editorRef.current;
    if (currentEditorRef) {
      currentEditorRef.addEventListener('dblclick', handleDoubleClick);
    }

    return () => {
      if (currentEditorRef) {
       currentEditorRef.removeEventListener('dblclick', handleDoubleClick);
      }
    };
  }, [editorRef, handleDoubleClick]);


  return (
    <div className={theme === 'dark' ? 'dark-theme' : ''}> {/* Apply dark-theme class conditionally */}
      {/* Apply global styles */}
      <style>{GLOBAL_STYLES}</style>

      <div className="max-w-4xl mx-auto p-4">
        {/* Theme Toggle Button (Example - place in toolbar or elsewhere) */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 rounded"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />} {/* Icons to indicate theme */}
          </button>
        </div>


        {/* Fixed Toolbar */}
        <Toolbar
          editor={editor}
          showTableDialog={showTableDialog}
          setShowTableDialog={setShowTableDialog}
          rows={rows}
          setRows={setRows}
          cols={cols}
          setCols={setCols}
          handleInsertTable={handleInsertTable}
          handleInsertVideo={handleInsertVideo}
          getButtonClass={getButtonClass}
        />

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