/*
 * ============================================
 * CODE EDITOR - Monaco Editor Wrapper
 * ============================================
 * 
 * This component wraps the Monaco Editor (the same editor used in VS Code).
 * 
 * Props:
 * - value: The code content
 * - onChange: Function called when code changes
 * - language: Programming language (javascript, python, etc.)
 * - readOnly: Whether the editor is read-only
 * 
 * Example usage:
 * <CodeEditor 
 *   value={code} 
 *   onChange={setCode} 
 *   language="javascript"
 * />
 */

import Editor from "@monaco-editor/react";

const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
}) => {
  // ============================================
  // HANDLE CODE CHANGE
  // ============================================
  // This function is called whenever the code changes
  
  const handleEditorChange = (newValue) => {
    // Call the onChange function passed from parent
    if (onChange) {
      onChange(newValue || "");
    }
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="h-full w-full">
      <Editor
        // Current code value
        value={value}
        
        // Programming language (for syntax highlighting)
        language={language}
        
        // Theme (dark theme looks professional)
        theme="vs-dark"
        
        // When code changes, call our handler
        onChange={handleEditorChange}
        
        // Editor options
        options={{
          // Show line numbers
          lineNumbers: "on",
          
          // Show minimap (small preview on right side)
          minimap: { enabled: true },
          
          // Auto-close brackets
          autoClosingBrackets: "always",
          
          // Auto-close quotes
          autoClosingQuotes: "always",
          
          // Format on paste
          formatOnPaste: true,
          
          // Format on type
          formatOnType: true,
          
          // Font size
          fontSize: 14,
          
          // Tab size (2 spaces)
          tabSize: 2,
          
          // Use spaces instead of tabs
          insertSpaces: true,
          
          // Word wrap
          wordWrap: "on",
          
          // Read-only mode
          readOnly: readOnly,
          
          // Smooth scrolling
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
