import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { deleteJournal } from "../../store/journals";
import { ModalContext } from "../../context/ModalContext";
import { PlaylistContext } from "../../context/playlistContext";

export default function DeleteConfirmation({ id }) {
  const dispatch = useDispatch();
  const { setJournal, journal } = useContext(JournalContext);
  const { setType } = useContext(ModalContext);
  const { setPlaylistId } = useContext(PlaylistContext);

  const deleteJournalHandler = () => {
    setType(null);
    dispatch(deleteJournal(journal.id));
    setJournal(null);
    setPlaylistId(null);
  };

  return (
    <div className="min-w-[24rem] max-w-fit h-fit p-8 bg-baby-powder rounded-3xl">
      <div className="flex flex-col gap-y-5">
        <p className="text-xl font-semibold">Confirm Delete</p>
        <div className="w-full border-[1px] border-black opacity-5"></div>
        <p className="text-lg">Are you sure you want to delete:</p>
        <p>
          <span className="font-medium">"</span> {journal.name}{" "}
          <span className="font-medium">"</span>
        </p>
        <div className="flex flex-row gap-x-5 justify-end">
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black hover:bg-slate-200 "
            onClick={() => setType(null)}
          >
            Cancel
          </button>
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black hover:bg-slate-200"
            onClick={deleteJournalHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
