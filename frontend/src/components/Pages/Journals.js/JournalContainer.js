import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import JournalNav from "./JournalNav";

export default function JournalContainer() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const quillRef = useRef(null);
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      ["bold", "italic", "underline"], // toggled buttons
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    ],
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const quill = quillRef.current.getEditor();
    const content = quill.getText();
    const formattedContent = quill.getContents();
    console.log(quill);
    console.log(content);
    console.log(formattedContent);
  };

  return (
    <div className="flex mx-2 my-2 w-[50%] bg-baby-powder rounded-3xl">
      <JournalNav />
      <div className="w-full p-10">
        <form onSubmit={submitHandler}>
          <ReactQuill
            modules={modules}
            ref={quillRef}
            value={body}
            onChange={setBody}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
