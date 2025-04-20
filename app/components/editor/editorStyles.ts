// app/components/editor/editorStyles.ts

export const GLOBAL_STYLES = `
/* Define CSS variables for light theme (default) */
:root {
  --page-bg: #ffffff;
  --page-text: #333333;
  --editor-bg: #ffffff;
  --toolbar-bg: #f8fafc;
  --toolbar-border: #e2e8f0;
  --button-hover-bg: #f1f5f9;
  --button-active-bg: #e0e7ff;
  --button-active-text: #4f46e5; 
  --button-text: #64748b;
  --text-color: #334155;
  --table-border: #cbd5e1;
  --table-header-bg: #f1f5f9;
  --code-block-bg: #1e293b;
  --code-block-text: #f8fafc;
  --blockquote-border: #6366f1;
  --placeholder-color: #94a3b8;
  --transition-speed: 200ms;
}

/* Dark theme styles using CSS variables */
.dark-theme {
  --page-bg: #0f172a;
  --page-text: #f8fafc;
  --editor-bg: #1e293b;
  --toolbar-bg: #0f172a;
  --toolbar-border: #334155;
  --button-hover-bg: #1e293b;
  --button-active-bg: #312e81;
  --button-active-text: #a5b4fc;
  --button-text: #cbd5e1;
  --text-color: #e2e8f0;
  --table-border: #475569;
  --table-header-bg: #334155;
  --code-block-bg: #0f172a;
  --code-block-text: #e2e8f0;
  --blockquote-border: #818cf8;
  --placeholder-color: #64748b;
  --transition-speed: 200ms;
}

/* Global editor styles */
.ProseMirror {
  background-color: var(--editor-bg);
  color: var(--text-color);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
  min-height: 200px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  padding: 1rem;
  outline: none !important;
  
  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--page-text);
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--page-text);
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--page-text);
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style-type: disc;
  }
  
  ol {
    list-style-type: decimal;
  }
  
  table {
    border-collapse: collapse;
    margin: 0 0 1rem 0;
    overflow: hidden;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid var(--table-border);
  }
  
  td, th {
    border: 1px solid var(--table-border);
    padding: 0.75rem;
    position: relative;
    vertical-align: top;
    font-size: 0.9rem;
    transition: background-color var(--transition-speed) ease;
  }
  
  th {
    background-color: var(--table-header-bg);
    font-weight: 600;
  }
  
  .code-block {
    background: var(--code-block-bg);
    color: var(--code-block-text);
    font-family: 'JetBrainsMono', 'Fira Code', monospace;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
    transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
  }
  
  blockquote {
    border-left: 4px solid var(--blockquote-border);
    margin: 1.5rem 0;
    padding: 0.5rem 0 0.5rem 1rem;
    font-style: italic;
    color: var(--text-color);
    background-color: rgba(99, 102, 241, 0.05);
    border-radius: 0 0.375rem 0.375rem 0;
  }

  blockquote p {
    margin: 0;
  }

  a {
    color: #4f46e5;
    text-decoration: none;
    transition: color var(--transition-speed) ease;
  }

  a:hover {
    text-decoration: underline;
  }

  hr {
    border: none;
    border-top: 2px solid var(--toolbar-border);
    margin: 1.5rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
    display: block;
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--placeholder-color);
    pointer-events: none;
    height: 0;
  }
}

/* Toolbar and editor container styles */
.editor-container {
  border: 1px solid var(--toolbar-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color var(--transition-speed) ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.editor-container:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.editor-toolbar {
  background-color: var(--toolbar-bg);
  border-bottom: 1px solid var(--toolbar-border);
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  transition: background-color var(--transition-speed) ease, border-color var(--transition-speed) ease;
}

.editor-toolbar-button {
  padding: 0.4rem;
  color: var(--button-text);
  background: transparent;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar-button:hover {
  background-color: var(--button-hover-bg);
}

.editor-toolbar-button.is-active {
  background-color: var(--button-active-bg);
  color: var(--button-active-text);
}

.editor-toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: var(--toolbar-border);
  margin: 0 0.25rem;
}

.editor-content {
  background-color: var(--editor-bg);
  min-height: 250px;
  transition: background-color var(--transition-speed) ease;
}

/* Table dialog styles */
.editor-table-dialog {
  background-color: var(--editor-bg);
  border: 1px solid var(--toolbar-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  position: absolute;
  z-index: 10;
  transition: background-color var(--transition-speed) ease, border-color var(--transition-speed) ease;
}

.editor-table-dialog input {
  padding: 0.5rem;
  border: 1px solid var(--toolbar-border);
  border-radius: 0.375rem;
  background-color: var(--editor-bg);
  color: var(--text-color);
  transition: border-color var(--transition-speed) ease;
}

.editor-table-dialog input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.editor-table-dialog button {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-speed) ease;
}

.editor-table-dialog button:hover {
  background-color: #4338ca;
}

/* Video placeholder styles */
.video-placeholder {
  background-color: rgba(99, 102, 241, 0.05);
  border: 1px dashed #6366f1;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  margin: 1rem 0;
  color: var(--text-color);
}

.video-placeholder a {
  color: #6366f1;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .editor-toolbar {
    overflow-x: auto;
    padding: 0.5rem;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
  }

  .editor-toolbar-button {
    padding: 0.5rem;
  }

  .editor-content {
    min-height: 200px;
  }

  .editor-table-dialog {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0.5rem 0.5rem 0 0;
    margin: 0;
  }
}

/* Improving accessibility for focus states */
.editor-toolbar-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.4);
}

.editor-toolbar-button:focus:not(:focus-visible) {
  box-shadow: none;
}
`;