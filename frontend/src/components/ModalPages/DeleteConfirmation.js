import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { deleteJournal } from "../../store/journals";
import { ModalContext } from "../../context/ModalContext";

export default function DeleteConfirmation({ id }) {
  const dispatch = useDispatch();
  const { setJournal, journal } = useContext(JournalContext);
  const { setType } = useContext(ModalContext);

  const deleteJournalHandler = () => {
    setType(null);
    dispatch(deleteJournal(journal.id));
    setJournal(null);
  };

  return (
    <div className="min-w-[24rem] max-w-fit h-fit p-8 bg-baby-powder rounded-3xl">
      <div className="flex flex-col gap-y-5">
        <p>Confirm Delete</p>
        {journal.name}
        <div className="flex flex-row gap-x-5 justify-end">
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black"
            onClick={() => setType(null)}
          >
            Cancel
          </button>
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black"
            onClick={deleteJournalHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
