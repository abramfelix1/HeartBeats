import { useState, useEffect, useContext, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getAllJournals } from "../../store/journals";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { JournalContext } from "../../context/journalContext";
import { ModalContext } from "../../context/ModalContext";
import { IoCreateOutline } from "react-icons/io5";
import { createJournal } from "../../store/journals";
import "./journal.css";
import { PlaylistContext } from "../../context/playlistContext";
import { getAllPlaylists } from "../../store/playlists";
import { AiOutlineSearch } from "react-icons/ai";
import { ReactComponent as CloseIcon } from "../../images/icons/outline/close.svg";
import { ReactComponent as TrashIcon } from "../../images/icons/outline/trash.svg";
import { ReactComponent as ComposeIcon } from "../../images/icons/outline/compose.svg";
import { ReactComponent as PlaylistIcon } from "../../images/icons/outline/playlist.svg";
import { ReactComponent as PlaylistAddIcon } from "../../images/icons/outline/add-playlist.svg";
import JournalNavItem from "./JournalNavItem";

export default function JournalNav() {
  const dispatch = useDispatch();
  const { setType } = useContext(ModalContext);
  const {
    toggleJournalPage,
    setJournalOpen,
    journalId,
    setJournalId,
    editorOpen,
    setEditorOpen,
  } = useContext(JournalContext);
  const { setPlaylistId } = useContext(PlaylistContext);
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

  const [filteredJournals, setFilteredJournals] = useState([]);

  const createJournalHandler = async () => {
    const journal = await dispatch(createJournal());
    setJournalId(journal.journal.id);
    setPlaylistId(null);
  };

  function convertTime(journalDate) {
    const date = new Date(journalDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    const time = `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;

    return time;
  }

  return (
    <div className="flex hover:cursor-default">
      <div className="flex flex-col bg-bkg-card relative py-4 rounded-l-3xl">
        <div className="px-4">
          <div className="flex flex-row justify-between text-txt-1 text-2xl font-semibold">
            <>Journals</>
            <CloseIcon
              className="fill-txt-1 w-8 h-fit hover:cursor-pointer"
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
        <div className="journal-list px-4 max-w-[700px] min-w-[700px] h-full">
          {sortedJournals ? (
            sortedJournals
              .filter((journal) =>
                journal.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((journalEntry, index) => (
                <div
                  className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-2 border rounded border-transparent relative hover:bg-bkg-nav"
                  key={journalEntry.id}
                  onClick={() => {
                    setJournalId(journalEntry.id);
                  }}
                >
                  <div className="text-center">{index + 1}</div>
                  <div className="flex items-center w-full min-w-0">
                    <JournalNavItem content={journalEntry.content} />
                    <div className="flex items-center gap-y-[0.5px] px-2 w-full truncate">
                      <div className="truncate ">{journalEntry.name}</div>
                    </div>
                  </div>
                  <div className="text-bkg-text text-sm truncate">
                    {convertTime(journalEntry.createdAt)}
                  </div>{" "}
                  <div className="flex flex-row gap-x-2 items-center">
                    <ComposeIcon
                      className="w-6 h-fit ml-3 m-0 fill-txt-hover hover:cursor-pointer outline-none border-none"
                      data-tooltip-id="journal-tooltip"
                      data-tooltip-content="Edit Journal"
                      onClick={(e) => {
                        setJournalId(journalEntry.id);
                        setEditorOpen(true);
                      }}
                    />
                    <TrashIcon
                      className="w-6 h-fit ml-3 m-0 fill-txt-hover hover:cursor-pointer outline-none border-none"
                      onClick={() => setType("DELETE")}
                      data-tooltip-id="journal-tooltip"
                      data-tooltip-content="Delete Journal"
                    />
                  </div>
                </div>
              ))
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
