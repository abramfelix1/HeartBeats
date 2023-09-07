import React, { useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { ThemeContext } from "../../context/themeContext";

export default function JournalNavItem({ content }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="min-w-[40px] min-h-[40px] bg-black relative hover:cursor-default">
      <div
        className={`flex justify-center items-center w-96 h-96 scale-[0.11] absolute left-[-172px] top-[-172px] z-10 ${
          theme === "dark" && "bg-slate-300"
        }`}
      >
        <ReactQuill
          value={content}
          readOnly={true}
          theme={"bubble"}
          style={{ backgroundColor: theme === "dark" ? "#404040" : "" }}
          className="quill-item"
        />
      </div>
    </div>
  );
}
