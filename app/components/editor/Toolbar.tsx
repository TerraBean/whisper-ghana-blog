// app/components/editor/Toolbar.tsx

import React, { useCallback } from 'react';
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
  Moon, // Import Moon Icon
  Sun,  // Import Sun Icon
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useEditor } from '@tiptap/react';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme Hook

interface ToolbarProps {
  editor: ReturnType<typeof useEditor> | null;
  showTableDialog: boolean;
  setShowTableDialog: React.Dispatch<React.SetStateAction<boolean>>;
  rows: number;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  cols: number;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  handleInsertTable: () => void;
  handleInsertVideo: () => void;
  getButtonClass: (active: boolean) => string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  showTableDialog,
  setShowTableDialog,
  rows,
  setRows,
  cols,
  setCols,
  handleInsertTable,
  handleInsertVideo,
  getButtonClass,
}) => {
  const { theme, toggleTheme } = useTheme(); // Use Theme Context

  return (
    <div className="bg-white border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-2">
      {/* Text Formatting */}
      <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('bold'))}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
          icon={<Bold size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('italic'))}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
          icon={<Italic size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('underline'))}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          title="Underline"
          icon={<UnderlineIcon size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('strike'))}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          icon={<Strikethrough size={24} />}
          buttonClass={getButtonClass}
        />
      </div>

      {/* Headings */}
      <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 1 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
          icon={<Heading1 size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 2 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          icon={<Heading2 size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 3 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          icon={<Heading3 size={24} />}
          buttonClass={getButtonClass}
        />
      </div>

      {/* Blocks & Lists */}
      <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('bulletList'))}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          icon={<List size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('orderedList'))}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
          icon={<ListOrdered size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('blockquote'))}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="Quote"
          icon={<Quote size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('codeBlock'))}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
          icon={<Code size={24} />}
          buttonClass={getButtonClass}
        />
      </div>

      {/* Alignment */}
      <div className="flex flex-wrap gap-2 border-r border-gray-200 pr-2">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'left' }))}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          title="Align Left"
          icon={<AlignLeft size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'center' }))}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          title="Align Center"
          icon={<AlignCenter size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'right' }))}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          title="Align Right"
          icon={<AlignRight size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'justify' }))}
          onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
          title="Align Justify"
          icon={<AlignJustify size={24} />}
          buttonClass={getButtonClass}
        />
      </div>

      {/* Media & Tools */}
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          isActive={() => false} // explicitly set isActive: false
          onClick={() => setShowTableDialog(true)}
          title="Insert Table"
          icon={<TableIcon size={24} />}
          buttonClass={getButtonClass}
        />
        {editor?.isActive('table') && (
          <ToolbarButton
            isActive={() => false} // explicitly set isActive: false
            onClick={() => editor?.chain().focus().deleteTable().run()}
            title="Delete Table"
            icon={<Minus size={24} />}
            buttonClass={getButtonClass}
          />
        )}
        <ToolbarButton
          isActive={() => false} // explicitly set isActive: false
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
          icon={<Minus size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => false} // explicitly set isActive: false
          onClick={handleInsertVideo}
          title="Insert Video"
          icon={<FileVideo size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => false} // explicitly set isActive: false
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Insert Image"
          icon={<ImageIcon size={24} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('link'))}
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run();
            }
          }}
          title="Insert Link"
          icon={<LinkIcon size={24} />}
          buttonClass={getButtonClass}
        />
         {/* Theme Toggle Button - Placed at the end of the toolbar */}
         <ToolbarButton
            isActive={() => false} // not a toggle button in terms of "active style"
            onClick={toggleTheme}
            title="Toggle Theme"
            icon={theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            buttonClass={getButtonClass}
          />
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
              onClick={handleInsertTable}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Insert Table
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;