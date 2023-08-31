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
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";
import { useDispatch } from "react-redux";
import { createJournal, updateJournal } from "../../store/journals";
import { getRecSongs } from "../../store/spotify";
import { getEnergy, getValence } from "../../utils/journal-analyzer";

export default function JournalEditor() {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const { journal, setJournal } = useContext(JournalContext);
  const { setErrors } = useContext(ErrorContext);
  const { setType } = useContext(ModalContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(journal?.content || "");

  useEffect(() => {
    if (journal) {
      setBody(journal?.content || "asdf");
      setTitle(journal?.name || "asdf");
    }
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
    if (title.length < 4) {
      setErrors({ name: "Name must have at least 4 characters minimum" });
      setType("ERROR");
      return;
    }
    dispatch(updateJournal(journal.id, { name: title, content: body })).catch(
      async (res) => {
        const data = await res.json();
        console.log(data.errors);
        setErrors(data.errors);
        setType("ERROR");
      }
    );
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
  }, [journal]);

  const createJournalHandler = async () => {
    console.log("CLICK CREATE JOURNAL");
    const journal = await dispatch(createJournal());
    console.log("NEW JOURNAL: ", journal);
    setJournal(journal.journal);
  };

  const recSongsHandler = (e) => {
    console.log("REC SONGS HANDLER");
    e.preventDefault();
    const quill = quillRef.current.getEditor();
    const content = quill.getText();
    const formattedContent = quill.getContents();
    console.log("CONTENT: ", content);
    const energy = getEnergy(content);
    const valence = getValence(content);
    dispatch(
      getRecSongs({
        valence: valence,
        energy: energy,
        genre: "pop",
      })
    );
  };

  return (
    <div className="w-full relative">
      {journal ? (
        <>
          <div className="flex flex-col w-full h-full pb-16 absolute ">
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="p-3 border-none rounded-tr-3xl focus:outline-none font-semibold"
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
                className="z-10  w-fit h-fit"
                onClick={(e) => submitHandler(e)}
              >
                Save
              </button>
              <button
                className="z-10  w-fit h-fit"
                onClick={(e) => {
                  recSongsHandler(e);
                }}
              >
                Generate Songs
              </button>
              <button className="z-10  w-fit h-fit">View Playlist</button>
            </div>
          </div>
          <Tooltip
            className="z-[999]"
            place="top"
            type="dark"
            effect="solid"
            id="toolbar-tooltip"
          />
        </>
      ) : (
        <div className="flex h-full justify-center items-center">
          <button
            className="w-fit h-fit p-5 rounded-3xl bg-blue-400 text-white font-semibold"
            onClick={createJournalHandler}
          >
            NEW JOURNAL
          </button>
        </div>
      )}
    </div>
  );
}
