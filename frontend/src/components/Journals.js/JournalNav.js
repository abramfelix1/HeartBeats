import { useState, useEffect, useContext, useMemo } from "react";
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
import JournalNavItem from "./JournalNavItem";

export default function JournalNav() {
  const dispatch = useDispatch();
  const { setType } = useContext(ModalContext);
  const { toggleJournalPage, setJournalOpen, journalId, setJournalId } =
    useContext(JournalContext);
  const { setPlaylistId } = useContext(PlaylistContext);

  const journals = useSelector((state) => Object.values(state.journals));
  const [searchInput, setSearchInput] = useState("");

  const closeHandler = () => {
    setJournalOpen(false);
  };

  // Allows ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeHandler();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const groupedJournals = useMemo(() => {
    return journals
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .reduce((acc, journal) => {
        const today = new Date();
        const journalDate = new Date(journal.updatedAt);
        let label;

        if (
          journalDate.getDate() === today.getDate() &&
          journalDate.getMonth() === today.getMonth() &&
          journalDate.getFullYear() === today.getFullYear()
        ) {
          label = "Today";
        } else if (
          journalDate.getDate() === today.getDate() - 1 &&
          journalDate.getMonth() === today.getMonth() &&
          journalDate.getFullYear() === today.getFullYear()
        ) {
          label = "Yesterday";
        } else {
          label = journalDate.toDateString();
        }

        if (!acc[label]) {
          acc[label] = [];
        }

        acc[label].push(journal);
        return acc;
      }, {});
  }, [journals]);

  const [filteredJournals, setFilteredJournals] = useState({});

  useEffect(() => {
    dispatch(getAllJournals());
    dispatch(getAllPlaylists());
  }, []);

  useEffect(() => {
    if (searchInput !== "") {
      const filteredGroup = {};

      for (let date in groupedJournals) {
        filteredGroup[date] = groupedJournals[date].filter((journal) =>
          journal.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        if (filteredGroup[date].length === 0) {
          delete filteredGroup[date];
        }
      }
      setFilteredJournals(filteredGroup);
    }
  }, [searchInput, groupedJournals]);

  const journalsToDisplay =
    searchInput === "" ? groupedJournals : filteredJournals;

  const [expandedGroups, setExpandedGroups] = useState(
    Object.keys(groupedJournals)
  );

  const toggleGroup = (groupName) => {
    setExpandedGroups((prevGroups) =>
      prevGroups.includes(groupName)
        ? prevGroups.filter((group) => group !== groupName)
        : [...prevGroups, groupName]
    );
  };

  const createJournalHandler = async () => {
    const journal = await dispatch(createJournal());
    setJournalId(journal.journal.id);
    setPlaylistId(null);
  };

  return (
    <div className="flex justify-end w-full">
      <div className="bg-bkg-card relative p-4 w-96">
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={"Search journals..."}
            className="bg-bkg-button pl-8 p-2 w-full rounded-full  border-2 border-transparent outline-none focus:border-text-txt-hover caret-text-txt-hover"
          />
        </div>
        <div className="journal-list flex flex-col gap-y-3 px-3 py-3 mb-1">
          {Object.entries(journalsToDisplay).map(([date, journals]) => (
            <div key={date} className="flex flex-col gap-y-1">
              <h2
                className="flex gap-x-2 items-center hover:cursor-pointer"
                onClick={() => toggleGroup(date)}
              >
                {expandedGroups.includes(date) ? (
                  <MdExpandLess />
                ) : (
                  <MdExpandMore />
                )}
                <p className="font-semibold">{date}</p>
              </h2>
              {expandedGroups.includes(date) &&
                journals.map((journalEntry) => (
                  <div
                    className={`flex flex-row gap-10 justify-between py-1 items-center  ${
                      journalId !== journalEntry.id
                        ? "text-bkg-text"
                        : "text-txt-hover"
                    }`}
                    key={journalEntry.id}
                    onClick={() => {
                      setJournalId(journalEntry.id);
                      // if (journalId !== journalEntry.id) setPlaylistId(null);
                    }}
                  >
                    <JournalNavItem content={journalEntry.content} />
                    <p className="truncate hover:cursor-pointer text-sm w-96">
                      {journalEntry.name}
                    </p>
                    {journalId === journalEntry.id && (
                      <TrashIcon
                        className="w-5 h-fit ml-3 m-0 text-txt-hover hover:cursor-pointer"
                        onClick={() => setType("DELETE")}
                      />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center px-3 text-white absolute bottom-0">
          <button
            className="bg-bkg-primary text-txt-2 flex justify-center items-center gap-x-2 my-4 py-2 px-5 w-fit h-fit rounded-xl  text-text font-semibold hover:bg-bkg-primary-hover"
            onClick={createJournalHandler}
          >
            <IoCreateOutline className="text-2xl" />
            <p>NEW</p>
          </button>
        </div>
      </div>
    </div>
  );
}
