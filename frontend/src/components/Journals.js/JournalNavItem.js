import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";

export default function JournalNavItem({ content }) {
  return (
    <div className="min-w-[40px] min-h-[40px] bg-black relative">
      <div className="flex justify-center items-center w-96 h-96 scale-[0.11] absolute left-[-172px] top-[-172px] z-10">
        <ReactQuill
          value={content}
          readOnly={true}
          theme={"bubble"}
          className="quill-item"
        />
      </div>
    </div>
  );
}
