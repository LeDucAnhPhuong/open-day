"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export default function CodeEditor({
  language,
  value,
  onChange,
  disabled,
}: CodeEditorProps) {
  return (
    <Editor
      height="70vh"
      defaultLanguage={language}
      defaultValue={value}
      theme="vs-dark"
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: disabled,
      }}
    />
  );
}
