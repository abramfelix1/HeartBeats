import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJournals } from "../../../store/journals";

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

  return (
    <div className="h-full w-64 bg-[#ececf5] rounded-l-3xl ">
      <div className="flex flex-col gap-y-3 items-center pt-20">
        {Object.entries(groupedJournals).map(([date, journalsOnDate]) => (
          <div key={date}>
            <h2>{date}</h2>
            {journalsOnDate.map((journal) => (
              <div key={journal.id}>
                <p>{journal.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
