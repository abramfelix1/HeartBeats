import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { Tooltip } from "react-tooltip";
import JournalNav from "./JournalNav";
import { JournalContext } from "../../context/journalContext";
import { useDispatch } from "react-redux";
import { updateJournal } from "../../store/journals";

export default function JournalEditor() {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const { journal } = useContext(JournalContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(journal?.content || "");

  useEffect(() => {
    setBody(journal?.content || "");
    setTitle(journal?.name || "");
  }, [journal]);

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
    console.log("QUILL: ", quill);
    console.log("CONTENT: ", content);
    console.log("FORMATTED: ", formattedContent);
    console.log("TITLE: ", title);
    console.log("BODY: ", typeof body, body);
    dispatch(updateJournal(journal.id, { name: title, content: body }));
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
    <div className="w-full relative">
      <Tooltip
        className="z-10"
        place="top"
        type="dark"
        effect="solid"
        id="toolbar-tooltip"
      />
      {journal ? (
        <>
          <div className="flex flex-col w-full h-full pb-16 absolute ">
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="p-3 border-none rounded-tr-3xl focus:outline-none"
            />
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
              <button
                className="z-10  w-fit h-fit hover:cursor-pointer"
                onClick={(e) => submitHandler(e)}
              >
                Save
              </button>
              <button>Generate Songs</button>
              <button>View Playlist</button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full justify-center items-center">
          <button className="w-fit h-fit p-5 rounded-3xl bg-blue-400">
            NEW JOURNAL
          </button>
        </div>
      )}
    </div>
  );
}
