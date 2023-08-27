import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { Tooltip } from "react-tooltip";
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

  useEffect(() => {
    const tooltips = {
      ".ql-bold": "Make text bold",
      ".ql-italic": "Italicize text",
      ".ql-underline": "Underline text",
      ".ql-font": "Choose font",
      ".ql-size": "Set font size",
      ".ql-color": "Change text color",
      ".ql-background": "Change text background color",
      ".ql-align": "Align text",
      '.ql-list[value="bullet"]': "Bullet list",
      '.ql-list[value="ordered"]': "Numbered list",
      '.ql-indent[value="-1"]': "Decrease indent",
      '.ql-indent[value="+1"]': "Increase indent",
    };

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.getModule("toolbar");
      console.log("TOOLBAR:", toolbar);
      for (let button in tooltips) {
        let btns = toolbar.container.querySelectorAll(button);
        btns.forEach((btn) => {
          btn.setAttribute("data-tooltip-id", "toolbar-tooltip");
          btn.setAttribute("data-tooltip-content", tooltips[button]);
        });
      }
    }
  }, []);

  return (
    <div className="flex mx-2 my-2 w-[50%] bg-baby-powder rounded-3xl">
      <JournalNav />
      <div className="w-full relative">
        <div
          className="flex flex-col w-full h-full pb-16 absolute"
          onSubmit={submitHandler}
        >
          <p className="py-5 text-center">NAME HERE</p>
          <ReactQuill
            modules={modules}
            ref={quillRef}
            value={body}
            onChange={setBody}
            className="sm:pb-52 md:pb-48 lg:pb-36, xl:pb-32"
          />
        </div>
        <div className="flex flex-row h-full items-end">
          <div className="flex flex-row w-full h-20 justify-around items-center">
            <button>Save</button>
            <button>Generate Songs</button>
            <button>View Playlist</button>
          </div>
        </div>
      </div>
      <Tooltip place="top" type="dark" effect="solid" id="toolbar-tooltip" />
    </div>
  );
}
