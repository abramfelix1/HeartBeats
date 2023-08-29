import React, { useEffect, useState, useContext } from "react";
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
  const { setJournal } = useContext(JournalContext);
  const journals = useSelector((state) => Object.values(state.journals));

  const sortedJournals = [...journals].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const groupedJournals = sortedJournals.reduce((acc, journal) => {
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

  useEffect(() => {
    dispatch(getAllJournals());
  }, []);

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
  console.log("EXPANDED GROUPS: ", expandedGroups);

  const createJournalHandler = async () => {
    console.log("CLICK CREATE JOURNAL");
    const journal = await dispatch(createJournal());
    console.log("NEW JOURNAL: ", journal);
    setJournal(journal.journal);
  };

  return (
    <div className="h-full w-64 bg-[#ececf5] rounded-l-3xl relative pb-2 ">
      <div className="flex p-5 px-3 text-white justify-start">
        <button
          className="flex justify-center items-center gap-x-2 p-2 w-fit h-fit rounded-xl bg-blue-400 text-white font-semibold"
          onClick={createJournalHandler}
        >
          <IoCreateOutline className="text-2xl" />
          <p>NEW</p>
        </button>
      </div>
      <div className="journal-list flex flex-col gap-y-3 px-3 sm:h-[70%] md:h-[78%] lg:h-[85%] xl:h-[87%] 2xl:h-[90%] ">
        {Object.entries(groupedJournals).map(([date, journals]) => (
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
              journals.map((journal) => (
                <div
                  className="flex flex-row gap-x-2 items-center"
                  key={journal.id}
                  onClick={() => setJournal(journal)}
                >
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis sm:w-[90px] md:w-[110px] lg:w-[130px] xl:w-[140px] 2xl:w-[150px] hover:cursor-pointer">
                    {journal.name}
                  </p>
                  <PiTrash
                    className="text-red-500 hover:cursor-pointer"
                    onClick={() => setType("DELETE")}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
