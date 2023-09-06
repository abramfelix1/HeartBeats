import React, { useRef, useState, useEffect, useContext } from "react";
import JournalNav from "./JournalNav";
import JournalEditor from "./JournalEditor";
import { JournalContext } from "../../context/journalContext";

export default function JournalContainer() {
  const { journalOpen } = useContext(JournalContext);

  return (
    <div className="flex right-0 h-full rounded-[100px] absolute">
      <JournalNav />
      <JournalEditor />
    </div>
  );
}
