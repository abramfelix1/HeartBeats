import React, { useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { ThemeContext } from "../../context/themeContext";

export default function JournalNavItem({ content, quillRef }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="min-w-[48px] min-h-[48px] bg-black relative hover:cursor-default">
      <div
        className={`flex justify-center items-center w-96 h-96 scale-[0.13] absolute left-[-168px] top-[-168px] z-10 ${
          theme === "dark" && "bg-slate-300"
        }`}
        onClick={(e) => {
          console.log("SDFASDFASDFSDAf");
        }}
      >
        <ReactQuill
          value={content}
          ref={quillRef}
          readOnly={true}
          theme={"bubble"}
          style={{ backgroundColor: theme === "dark" ? "#404040" : "" }}
          className="quill-item"
        />
      </div>
    </div>
  );
}
