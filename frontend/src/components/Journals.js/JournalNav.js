import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getAllJournals } from "../../store/journals";
import { JournalContext } from "../../context/journalContext";
import { ModalContext } from "../../context/ModalContext";
import { createJournal } from "../../store/journals";
import "./journal.css";
import { PlaylistContext } from "../../context/playlistContext";
import { AiOutlineSearch } from "react-icons/ai";
import { ReactComponent as CloseIcon } from "../../images/icons/outline/close.svg";
import { ReactComponent as TrashIcon } from "../../images/icons/outline/trash.svg";
import { ReactComponent as ComposeIcon } from "../../images/icons/outline/compose.svg";
import JournalNavItem from "./JournalNavItem";
import { getRecSongs, resetRecSongsAction } from "../../store/spotify";
import { convertTime } from "../../utils/helper";

export default function JournalNav() {
  const dispatch = useDispatch();
  const { setType, setDeleteId } = useContext(ModalContext);
  const quillRefs = useRef([]);
  const {
    journalId,
    setJournalOpen,
    setJournalId,
    setEditorOpen,
    journalContent,
    setJournalContent,
  } = useContext(JournalContext);
  const { setPlaylistId, setIsSongRecsShown } = useContext(PlaylistContext);
  const journals = useSelector((state) => Object.values(state.journals));
  const [searchInput, setSearchInput] = useState("");

  const closeHandler = () => {
    setJournalOpen(false);
  };

  useEffect(() => {
    dispatch(getAllJournals());
    // dispatch(getAllPlaylists());
  }, []);

  const sortedJournals = useMemo(() => {
    return journals.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [journals]);

  const createJournalHandler = async () => {
    // const journal = await dispatch(createJournal());
    // setJournalId(journal.journal.id);
    dispatch(resetRecSongsAction());
    setEditorOpen(true);
    setJournalId(null);
    setJournalContent(null);
  };

  const getJournalContents = (index) => {
    const quillInstance = quillRefs.current[index].current;
    if (quillInstance) {
      const content = quillRefs.current[index].current.getEditor().getText();
      setJournalContent(content);
    }
    console.log("JOURNAL CONTENT: ", journalContent);
  };

  const recSongsHandler = (valence, energy) => {
    console.log("REC SONGS HANDLER");
    if (valence !== null && energy !== null) {
      dispatch(
        getRecSongs({
          valence: valence,
          energy: energy,
          genre: "pop",
        })
      );
    } else {
      dispatch(resetRecSongsAction());
      setJournalContent(null);
      // setJournalId(null);
    }
  };
  // 2xl:min-w-[700px] xl:min-w-[550px] lg:min-w-[400px] md:min-w-[350px]
  return (
    <div className="flex flex-grow hover:cursor-default h-full w-full rounded-l-3xl">
      <div className="flex flex-grow flex-col bg-bkg-card relative py-4 rounded-l-3xl">
        <div className="px-4">
          <div className="flex flex-row justify-between text-txt-1 text-2xl font-semibold">
            <>Journals</>
            <CloseIcon
              className="fill-txt-1 w-8 h-fit hover:cursor-pointer hover:scale-110"
              onClick={closeHandler}
            />
          </div>
          <div className="p-4 relative flex items-center">
            <AiOutlineSearch className="text-xl absolute left-6" />
            <input
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder={"Search journals..."}
              className="bg-bkg-button pl-8 p-2 w-full rounded-full  border-2 border-transparent outline-none focus:border-text-txt-hover caret-text-txt-hover"
            />
            <div className="flex justify-center px-3 text-white bottom-0">
              <button
                className="text-bkg-text hover:scale-105 hover:txt-hover w-fit h-fit p-1 font-bold "
                onClick={createJournalHandler}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className="text-bkg-text text-sm grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-1 border-b-[1px] border-b-bkg-nav relative">
            <div className="text-center">#</div>
            <div className="">Title</div>
            <div className="">Created At</div>
          </div>
        </div>
        <div className="journal-list px-4 h-full">
          {sortedJournals ? (
            sortedJournals
              .filter((journal) =>
                journal.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((journalEntry, index) => {
                if (!quillRefs.current[index]) {
                  quillRefs.current[index] = React.createRef();
                }
                return (
                  <div
                    className={`grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-2 border rounded border-transparent relative hover:bg-bkg-nav
                    ${journalId === journalEntry.id && "bg-bkg-nav"}
                    `}
                    key={journalEntry.id}
                    onClick={() => {
                      setJournalId(journalEntry.id);
                      setIsSongRecsShown(true);
                      getJournalContents(index);
                      recSongsHandler(journalEntry.mood, journalEntry.energy);
                    }}
                  >
                    <div className="text-center">{index + 1}</div>
                    <div className="flex items-center w-full min-w-0">
                      <JournalNavItem
                        content={journalEntry.content}
                        quillRef={quillRefs.current[index]}
                      />
                      <div className="flex items-center gap-y-[0.5px] px-2 w-full truncate">
                        <div className="truncate ">{journalEntry.name}</div>
                      </div>
                    </div>
                    <div className="text-bkg-text text-sm truncate">
                      {convertTime(journalEntry.createdAt)}
                    </div>{" "}
                    <div className="flex flex-row gap-x-2 items-center">
                      <ComposeIcon
                        className="w-6 h-fit ml-3 m-0 fill-txt-hover hover:cursor-pointer outline-none border-none hover:scale-105"
                        data-tooltip-id="journal-tooltip"
                        data-tooltip-content="Edit Journal"
                        onClick={(e) => {
                          e.stopPropagation();
                          setJournalId(journalEntry.id);
                          setEditorOpen(true);
                        }}
                      />
                      <TrashIcon
                        className="w-6 h-fit ml-3 m-0 fill-txt-hover hover:cursor-pointer outline-none border-none hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(journalEntry.id);
                          setType("DELETE");
                        }}
                        data-tooltip-id="journal-tooltip"
                        data-tooltip-content="Delete Journal"
                      />
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex h-full items-center justify-center text-xl">
              NO MATCHING JOURNALS FOUND
            </div>
          )}
        </div>
        <Tooltip
          className="z-10"
          place="top"
          type="dark"
          effect="solid"
          id="journal-tooltip"
        />
      </div>
    </div>
  );
}
