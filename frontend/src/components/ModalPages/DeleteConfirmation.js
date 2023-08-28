import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { deleteJournal } from "../../store/journals";

export default function DeleteConfirmation({ id }) {
  const dispatch = useDispatch();
  const { journal } = useContext(JournalContext);

  const deleteJournalHandler = () => {
    dispatch(deleteJournal(journal.id));
  };

  return (
    <div className="flex w-10 h-10 bg-blue-400">DELETE {journal.name}?</div>
  );
}
