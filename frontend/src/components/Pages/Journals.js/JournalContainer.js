import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import JournalNav from "./JournalNav";

export default function JournalContainer() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const quillRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    const quill = quillRef.current.getEditor();
    const content = quill.getText();
    console.log(quill);
    console.log(content);
  };

  return (
    <div className="flex mx-2 my-2 w-[50%] bg-baby-powder rounded-3xl">
      <JournalNav />
      <div className="w-full p-10">
        <form onSubmit={submitHandler}>
          <ReactQuill ref={quillRef} value={body} onChange={setBody} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
