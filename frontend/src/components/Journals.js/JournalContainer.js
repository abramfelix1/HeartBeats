import React, { useRef, useState, useEffect, useContext } from "react";
import JournalNav from "./JournalNav";
import JournalEditor from "./JournalEditor";
import { JournalContext } from "../../context/journalContext";

export default function JournalContainer() {
  const { journalOpen } = useContext(JournalContext);

  return (
    <div className="flex flex-grow mr-2 my-2 rounded-[100px]">
      <JournalNav />
      <JournalEditor />
    </div>
  );
}
