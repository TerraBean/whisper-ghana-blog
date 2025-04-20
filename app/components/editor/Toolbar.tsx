// app/components/editor/Toolbar.tsx

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
  Moon,
  Sun,
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useEditor } from '@tiptap/react';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="editor-toolbar">
      {/* Text Formatting */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('bold'))}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
          icon={<Bold size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('italic'))}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
          icon={<Italic size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('underline'))}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          title="Underline"
          icon={<UnderlineIcon size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('strike'))}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          icon={<Strikethrough size={18} />}
          buttonClass={getButtonClass}
        />
      </div>

      <div className="editor-toolbar-divider" />

      {/* Headings */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 1 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
          icon={<Heading1 size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 2 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          icon={<Heading2 size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('heading', { level: 3 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          icon={<Heading3 size={18} />}
          buttonClass={getButtonClass}
        />
      </div>

      <div className="editor-toolbar-divider" />

      {/* Lists */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('bulletList'))}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          icon={<List size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('orderedList'))}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
          icon={<ListOrdered size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('blockquote'))}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="Quote"
          icon={<Quote size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive('codeBlock'))}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
          icon={<Code size={18} />}
          buttonClass={getButtonClass}
        />
      </div>

      <div className="editor-toolbar-divider" />

      {/* Alignment */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'left' }))}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          title="Align Left"
          icon={<AlignLeft size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'center' }))}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          title="Align Center"
          icon={<AlignCenter size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'right' }))}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          title="Align Right"
          icon={<AlignRight size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => Boolean(editor?.isActive({ textAlign: 'justify' }))}
          onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
          title="Align Justify"
          icon={<AlignJustify size={18} />}
          buttonClass={getButtonClass}
        />
      </div>

      <div className="editor-toolbar-divider" />

      {/* Media & Tools */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          isActive={() => false}
          onClick={() => setShowTableDialog(true)}
          title="Insert Table"
          icon={<TableIcon size={18} />}
          buttonClass={getButtonClass}
        />
        {editor?.isActive('table') && (
          <ToolbarButton
            isActive={() => false}
            onClick={() => editor?.chain().focus().deleteTable().run()}
            title="Delete Table"
            icon={<Minus size={18} />}
            buttonClass={getButtonClass}
          />
        )}
        <ToolbarButton
          isActive={() => false}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
          icon={<Minus size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => false}
          onClick={handleInsertVideo}
          title="Insert Video"
          icon={<FileVideo size={18} />}
          buttonClass={getButtonClass}
        />
        <ToolbarButton
          isActive={() => false}
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Insert Image"
          icon={<ImageIcon size={18} />}
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
          icon={<LinkIcon size={18} />}
          buttonClass={getButtonClass}
        />
      </div>

      {/* Spacer to push theme toggle to the right */}
      <div className="flex-grow"></div>

      {/* Theme Toggle Button */}
      <ToolbarButton
        isActive={() => false}
        onClick={toggleTheme}
        title="Toggle Theme"
        icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        buttonClass={getButtonClass}
      />
    </div>
  );
};

export default Toolbar;