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

export default function JournalNav() {
  const dispatch = useDispatch();
  const { setType } = useContext(ModalContext);
  const { journal, setJournal } = useContext(JournalContext);

  const journals = useSelector((state) => Object.values(state.journals));
  const [searchInput, setSearchInput] = useState("");

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
    setJournal(journal.journal);
  };

  return (
    <div className="h-full w-64 bg-[#ececf5] rounded-l-3xl relative pb-2 ">
      <div className="p-4 pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search journals..."
          className="p-2 w-full rounded"
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
              <p className="">{date}</p>
            </h2>
            {expandedGroups.includes(date) &&
              journals.map((journalEntry) => (
                <div
                  className="flex flex-row gap-x-2 py-1 items-center text-sm"
                  key={journalEntry.id}
                  onClick={() => setJournal(journalEntry)}
                >
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis sm:w-[90px] md:w-[110px] lg:w-[130px] xl:w-[140px] 2xl:w-[150px] hover:cursor-pointer">
                    {journalEntry.name}
                  </p>
                  {journal && journal.id === journalEntry.id && (
                    <PiTrash
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => setType("DELETE")}
                    />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-center px-3 text-white absolute bottom-0">
        <button
          className="flex justify-center items-center gap-x-2 my-2 py-2 px-5 w-fit h-fit rounded-xl bg-blue-400 text-white font-semibold"
          onClick={createJournalHandler}
        >
          <IoCreateOutline className="text-2xl" />
          <p>NEW</p>
        </button>
      </div>
    </div>
  );
}
