import React, { useEffect, useRef } from 'react';

interface TextEditorProps {
  name: string;
  value: string;
  onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ name, value, onChange }) => {
  const editorRef = useRef<any>(null);
  const editorId = `editor_${name}`; // Unique ID for CKEditor instance

  useEffect(() => {
    // Initialize CKEditor
    if (window.CKEDITOR && !editorRef.current) {
      const editor = window.CKEDITOR.replace(editorId, {
        height: 400,
        // toolbar: [
        //   { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
        //   { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
        //   { name: 'links', items: ['Link', 'Unlink'] },
        //   { name: 'insert', items: ['Image', 'Table', 'HorizontalRule'] },
        //   { name: 'styles', items: ['Styles', 'Format'] },
        //   { name: 'tools', items: ['Maximize'] },
        //   { name: 'document', items: ['Source'] },
        // ],
      });

      editorRef.current = editor;

      // Set initial value
      if (value) {
        editor.setData(value);
      }

      // Update content on change
      editor.on('change', () => {
        const data = editor.getData();
        onChange(data);
      });

      // Cleanup on unmount
      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [editorId, value, onChange]);

  return (
    <div className="form-group form-vertical">
      <label htmlFor={editorId}>Content</label>
      <div id={editorId} data-name={name}></div>
    </div>
  );
};

export default TextEditor;
