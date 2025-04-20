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
import { Moon, Sun } from 'lucide-react';

import { GLOBAL_STYLES } from './editorStyles';
import Toolbar from './Toolbar';
import { useTheme } from '../../contexts/ThemeContext';
import { TiptapContent } from '@/app/types';

const lowlight = createLowlight({});

interface EditorProps {
  setContent: React.Dispatch<React.SetStateAction<TiptapContent | null>>;
  initialContent?: TiptapContent | null;
}

const Editor: React.FC<EditorProps> = ({ setContent, initialContent }) => {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [editorReady, setEditorReady] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const initialContentLoadedRef = useRef(false);

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
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      Placeholder.configure({ placeholder: 'Start writing your content here...' }),
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
      handleDOMEvents: {
        focus: () => {
          setIsFocused(true);
          return false;
        },
        blur: () => {
          setIsFocused(false);
          return false;
        },
      },
    },
    // Update editor content whenever editor state changes
    onUpdate({ editor }) {
      const jsonContent = editor.getJSON();

      // Ensure 'type' is defined before setting content
      if (jsonContent && jsonContent.type === undefined) {
        jsonContent.type = 'doc'; 
      }
    
      setContent(jsonContent as TiptapContent); 
    },
    content: initialContent || { type: 'doc', content: [] },
    onCreate() {
      setEditorReady(true);
    }
  });

  // Handle initial content when editor is ready
  useEffect(() => {
    // Only run this effect if we have an editor, it's ready, and we haven't loaded content yet
    if (editor && editorReady && initialContent && !initialContentLoadedRef.current) {
      initialContentLoadedRef.current = true;
      
      // Set the editor content directly, without clearing first
      editor.commands.setContent(initialContent);
    }
  }, [editor, editorReady, initialContent]);

  // Utility functions
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
    return `editor-toolbar-button ${active ? 'is-active' : ''}`;
  }, []);

  // Editor Lifecycle Effects
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
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
      {/* Apply global styles */}
      <style>{GLOBAL_STYLES}</style>

      <div className={`editor-container transition-all duration-200 ${isFocused ? 'ring-2 ring-indigo-300 dark:ring-indigo-800' : ''}`}>
        {/* Toolbar */}
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
          className="editor-content"
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="editor-table-dialog">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Insert Table</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rows</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                />
              </div>
              <div>
                <label class    ="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Columns</label>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setShowTableDialog(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertTable}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;