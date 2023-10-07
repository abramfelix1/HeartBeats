import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { Tooltip } from "react-tooltip";
import JournalNav from "./JournalNav";
import { JournalContext } from "../../context/journalContext";
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";
import {
  addPlaylistAction,
  createJournal,
  updateJournal,
} from "../../store/journals";
import {
  getPlaylist,
  createPlaylist,
  deletePlaylist,
} from "../../store/playlists";
import { getRecSongs, resetRecSongsAction } from "../../store/spotify";
import { getEnergy, getValence } from "../../utils/journal-analyzer";
import { PlaylistContext } from "../../context/playlistContext";
import SearchSpotify from "../Songs/SearchSpotify";
import { HowlerContext } from "../../context/howlerContext";
import { ThemeContext } from "../../context/themeContext";

export default function JournalEditor() {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const {
    journalId,
    setJournalId,
    editorOpen,
    setEditorOpen,
    setJournalContent,
    filterOpen,
    setFilterOpen,
    filters,
    setFilters,
  } = useContext(JournalContext);
  const { playlistId, setPlaylistId, isSongRecsShown, setIsSongRecsShown } =
    useContext(PlaylistContext);
  const { errors, setErrors } = useContext(ErrorContext);
  const { type, setType } = useContext(ModalContext);
  const { theme } = useContext(ThemeContext);
  const { stopSound, playSound, remainingTime, currentPlaying, isPlaying } =
    useContext(HowlerContext);
  const journalEntry = useSelector((state) =>
    journalId ? state.journals[journalId] : null
  );
  const [title, setTitle] = useState("Untitled");
  const [body, setBody] = useState(journalEntry?.content || "");
  const [triggerRecSongs, setTriggerRecSongs] = useState(false);
  const editorRef = useRef(null);
  const [filterHover, setFilterHover] = useState(false);
  const filterCount = useSelector((state) =>
    state.journals[journalId]?.filterCount
      ? state.journals[journalId].filterCount
      : 0
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (errors || type === "ERROR") return;
      if (event.keyCode === 27) {
        setEditorOpen(false);
        setFilterOpen(false);
        setFilters([]);
        stopSound();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [type, errors, filterOpen]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (type === "ERROR" || filterOpen) return;
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        setEditorOpen(false);
        setFilterOpen(false);
        setFilters([]);
        stopSound();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [type, errors, filterOpen]);

  useEffect(() => {
    if (journalEntry) {
      setBody(journalEntry?.content || "");
      setTitle(journalEntry?.name || "");
      if (journalEntry?.playlist) {
        setPlaylistId(journalEntry.playlist.id);
      } else {
        setPlaylistId(null);
      }
    }
    // dispatch(resetRecSongsAction());
  }, [journalId]);

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

  const recSongsHandler = (e) => {
    console.log("REC SONGS HANDLER");
    const quill = quillRef.current.getEditor();
    const content = quill.getText();
    const formattedContent = quill.getContents();
    // console.log("CONTENT: ", content);
    // const energy = getEnergy(content);
    // const valence = getValence(content);
    console.log(journalEntry.filter);
    dispatch(resetRecSongsAction());
    dispatch(
      getRecSongs({
        filter: journalEntry.filter,
      })
    ).catch(async (res) => {
      const data = await res.json();
      console.log(data.errors);
      setErrors(data.errors);
      setType("ERROR");
    });
    setJournalContent(content);
  };

  useEffect(() => {
    if (triggerRecSongs && journalEntry && journalEntry?.filter) {
      recSongsHandler();
      setTriggerRecSongs(false);
    }
  }, [journalEntry?.filter, triggerRecSongs]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const quill = quillRef.current.getEditor();
    const content = quill.getText();
    const formattedContent = quill.getContents();
    // console.log("QUILL: ", quill);
    // console.log("CONTENT: ", content);
    // console.log("FORMATTED: ", formattedContent);
    // console.log("TITLE: ", title);
    // console.log("BODY: ", typeof body, body);
    if (title.length < 4) {
      setErrors({ name: "Name must have at least 4 characters minimum" });
      setType("ERROR");
      return;
    }
    if (content.trim().length < 1) {
      setErrors({ name: "Journal cannot be empty" });
      setType("ERROR");
      return;
    }
    const energy = getEnergy(content);
    const valence = getValence(content);
    let journal;
    let hasError;
    if (journalId) {
      await dispatch(
        updateJournal(journalId, {
          name: title,
          content: body,
          energy: Number(energy),
          valence: Number(valence),
        })
      ).catch(async (res) => {
        const data = await res.json();
        console.log(data.errors);
        setErrors(data.errors);
        setType("ERROR");
        hasError = true;
        return;
      });
      if (!hasError) {
        setTriggerRecSongs(true);
        // recSongsHandler();
        setEditorOpen(false);
        setFilters([]);
        stopSound();
      }
    } else {
      journal = await dispatch(
        createJournal({
          name: title,
          content: body,
          energy: Number(energy),
          valence: Number(valence),
        })
      ).catch(async (res) => {
        const data = await res.json();
        console.log(data.errors);
        setErrors(data.errors);
        setType("ERROR");
        hasError = true;
        return;
      });
      if (!hasError) {
        setJournalId(journal.journal.id);
        setFilters([]);
        stopSound();
      }
    }
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
      // console.log("TOOLBAR:", toolbar);
      for (let button in tooltips) {
        let btns = toolbar.container.querySelectorAll(button);
        btns.forEach((btn) => {
          btn.setAttribute("data-tooltip-id", "toolbar-tooltip");
          btn.setAttribute("data-tooltip-content", tooltips[button]);
        });
      }
    }
  }, [journalEntry]);

  return (
    <div
      ref={editorRef}
      className={`bg-bkg-card flex-col justify-center rounded-3xl  relative w-96 shadow-xl ml-20 mt-20 mb-20 z-[3]
      ${filterOpen && "rounded-r-none"}
  `}
    >
      <>
        <div className="flex flex-col w-full h-full">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={`bg-bkg-card p-3 border-none rounded-3xl focus:outline-none font-medium
            ${filterOpen && "rounded-r-none"}
            `}
          />
          <ReactQuill
            modules={modules}
            ref={quillRef}
            value={body}
            onChange={setBody}
            className={` text-black overflow-hidden ${
              theme === "dark" ? "bg-slate-300" : "bg-white"
            }`}
          />
          <div className="flex flex-col">
            <div className="flex justify-center p-4  border-b-[1px] border-b-bkg-nav">
              {journalId ? (
                <p
                  className={`text-bkg-text font-medium hover:cursor-pointer ${
                    filterHover && "scale-105 text-txt-hover "
                  }`}
                  onMouseEnter={(e) => setFilterHover(true)}
                  onMouseLeave={(e) => setFilterHover(false)}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  Filters{` ${filterCount > 0 ? `(${filterCount})` : ""}`}
                </p>
              ) : (
                <p
                  className={`text-bkg-text font-medium cursor-default
                  `}
                >
                  Create Journal to Access Filters
                </p>
              )}
            </div>
            <div className="flex flex-row w-full h-full p-5 bg-bkg-card justify-around items-center rounded-b-3xl">
              <button
                className="text-bkg-text hover:scale-105 hover:text-txt-hover w-fit h-fit p-1 font-medium "
                onClick={(e) => {
                  setEditorOpen(false);
                  setFilterOpen(false);
                  setFilters([]);
                }}
              >
                Close
              </button>
              {journalEntry ? (
                <button
                  className="text-bkg-text hover:scale-105 hover:text-txt-hover w-fit h-fit p-1 font-medium"
                  onClick={(e) => submitHandler(e)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="text-bkg-text hover:scale-105 hover:text-txt-hover w-fit h-fit p-1 font-medium"
                  onClick={(e) => submitHandler(e)}
                >
                  Create
                </button>
              )}
            </div>
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
      {/* <div className="absolute left-[360px] top-0 h-full">
        {filterOpen && <SearchSpotify />}
      </div> */}
    </div>
  );
}
