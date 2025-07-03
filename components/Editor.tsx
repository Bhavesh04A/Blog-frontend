"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { FC } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"]
  ]
};

const formats = [
  "header", "bold", "italic", "underline", "strike",
  "color", "background", "list",
  "blockquote", "code-block", "link", "image"
];

const Editor: FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="Write your blog content here..."
        className="h-64 mb-12"
      />
    </div>
  );
};

export default Editor;
