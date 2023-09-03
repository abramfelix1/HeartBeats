import React, { createContext, useEffect, useState } from "react";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [journalId, setJournalId] = useState(null);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    console.log("JOURNAL CONTEXT: ", journalId);
  }, [journalId]);

  const toggleJournalPage = () => {
    console.log("JOURNAL OPEN: ", journalOpen);
    setJournalOpen(!journalOpen);
  };

  return (
    <JournalContext.Provider
      value={{
        journalId,
        setJournalId,
        setJournalOpen,
        toggleJournalPage,
        journalOpen,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
