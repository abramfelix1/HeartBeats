import React, { useRef, useState, useEffect } from "react";
import JournalNav from "./JournalNav";
import JournalEditor from "./JournalEditor";

export default function JournalContainer() {
  return (
    <div className="flex mx-2 my-2 w-[50%] bg-baby-powder rounded-3xl">
      <JournalNav />
      <JournalEditor />
    </div>
  );
}
