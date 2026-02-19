"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill only on the client
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Import Quill CSS
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "link",
];

export function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <ReactQuill
      value={value}
      onChange={(content, delta, source, editor) => {
        if (source === 'user') {
          onChange(content);
        }
      }}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      theme="snow"
    />
  );
}