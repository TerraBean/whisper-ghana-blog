// app/components/editor/editorStyles.ts

export const GLOBAL_STYLES = `
/* Define CSS variables for light theme (default) */
:root {
  --page-bg: #f9f9f9; /* Light page background */
  --page-text: #333333; /* Dark page text */
  --editor-bg: #ffffff;
  --toolbar-bg: #ffffff;
  --toolbar-border: #e5e5e5;
  --button-hover-bg: #f2f2f2;
  --button-active-bg: #e0e0e0;
  --button-text: #333333;
  --text-color: #333333;
  --table-border: #ced4da;
  --table-header-bg: #f8f9fa;
  --code-block-bg: #0d0d0d;
  --code-block-text: #ffffff;
  --blockquote-border: #0d0d0d;
  --placeholder-color: #adb5bd;
}

/* Dark theme styles using CSS variables */
.dark-theme {
  --page-bg: #181818; /* Dark page background */
  --page-text: #ffffff; /* White page text */
  --editor-bg: #121212; /* Dark background for editor */
  --toolbar-bg: #1e1e1e; /* Dark background for toolbar */
  --toolbar-border: #333333; /* Darker border for toolbar */
  --button-hover-bg: #2a2a2a; /* Darker hover for buttons */
  --button-active-bg: #444444; /* Darker active button */
  --button-text: #ffffff; /* Light text for buttons in dark theme */
  --text-color: #ffffff; /* Light text color for content */
  --table-border: #555555; /* Darker table border */
  --table-header-bg: #333333; /* Darker table header */
  --code-block-bg: #222222; /* Slightly lighter dark code block background */
  --code-block-text: #f8f8f8; /* Light code block text */
  --blockquote-border: #f8f9fa; /* Light blockquote border for contrast */
  --placeholder-color: #777777; /* Darker placeholder text */
}

.ProseMirror {
  background-color: var(--editor-bg); /* Use CSS variable */
  color: var(--text-color); /* Use CSS variable */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    width: 100%;
  }
  td, th {
    border: 1px solid var(--table-border); /* Use CSS variable */
    padding: 8px;
    min-width: 40px;
    position: relative;
    vertical-align: top;
    font-size: 0.9rem;
  }
  th {
    background-color: var(--table-header-bg); /* Use CSS variable */
  }
  .code-block {
    background: var(--code-block-bg); /* Use CSS variable */
    color: var(--code-block-text); /* Use CSS variable */
    font-family: 'JetBrainsMono', monospace;
    padding: 0.8rem;
    border-radius: 0.5rem;
    margin: 0.8rem 0;
    font-size: 0.9rem;
    overflow-x: auto;
  }
  blockquote {
    border-left: 3px solid var(--blockquote-border); /* Use CSS variable */
    margin-left: 0;
    padding-left: 0.8rem;
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
    color: var(--placeholder-color); /* Use CSS variable */
    pointer-events: none;
    height: 0;
  }

}

/* Mobile-specific styles using media queries - already using CSS variables correctly */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .bg-white.border.border-gray-200.rounded-t-lg.p-2.flex.flex-wrap.gap-2 {
    background-color: var(--toolbar-bg);
    border-color: var(--toolbar-border);
    padding: 0.5rem;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .p-2.hover\:bg-gray-100.rounded {
    background-color: var(--toolbar-bg);
    color: var(--button-text);
    padding: 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    margin: 2px;
  }

  .p-2.hover\:bg-gray-100.rounded:hover {
    background-color: var(--button-hover-bg);
  }

  .bg-gray-200 { /* Style for active button */
     background-color: var(--button-active-bg);
  }


  .flex.flex-wrap.gap-2.border-r.border-gray-200.pr-2 {
    border-right: none;
    padding-right: 0;
    margin-bottom: 0.5rem;
  }


  .border.border-gray-200.rounded-b-lg.p-4.min-h-\[300px\].max-h-\[400px\].overflow-y-auto {
    background-color: var(--editor-bg);
    color: var(--text-color);
    border-color: var(--toolbar-border);
    border-radius: 0;
    padding: 1rem;
    min-height: 250px;
    max-height: none;
    border-left: none;
    border-right: none;
  }

  .absolute.mt-2.p-2.bg-gray-50.rounded-lg.shadow-md {
    background-color: var(--toolbar-bg);
    color: var(--text-color);
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 0;
    border-radius: 0;
    width: 100%;
    box-shadow: none;
    padding: 1rem;
    z-index: 10;
  }
}
`;