import React, { createContext, useEffect, useState } from "react";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [journal, setJournal] = useState(null);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    console.log("JOURNAL CONTEXT: ", journal);
  }, [journal]);

  const toggleJournalPage = () => {
    console.log("JOURNAL OPEN: ", journalOpen);
    setJournalOpen(!journalOpen);
  };

  return (
    <JournalContext.Provider
      value={{
        journal,
        setJournal,
        setJournalOpen,
        toggleJournalPage,
        journalOpen,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
