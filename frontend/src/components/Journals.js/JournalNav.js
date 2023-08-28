import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJournals } from "../../store/journals";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { PiTrash } from "react-icons/pi";

export default function JournalNav() {
  const dispatch = useDispatch();
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

  return (
    <div className="h-full w-64 bg-[#ececf5] rounded-l-3xl relative ">
      <div className="flex flex-col gap-y-3 px-3 pt-20 absolute">
        {Object.entries(groupedJournals).map(([date, journals]) => (
          <div key={date}>
            <h2
              className="flex gap-x-2 items-center hover:cursor-pointer"
              onClick={() => toggleGroup(date)}
            >
              {date}
              {expandedGroups.includes(date) ? (
                <MdExpandLess />
              ) : (
                <MdExpandMore />
              )}
            </h2>
            {expandedGroups.includes(date) &&
              journals.map((journal) => (
                <div
                  className="flex flex-row gap-x-2 items-center"
                  key={journal.id}
                >
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis sm:w-[90px] md:w-[110px] lg:w-[130px] xl:w-[140px] 2xl:w-[150px]">
                    {journal.name}
                  </p>
                  <PiTrash className="text-red-500" />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
