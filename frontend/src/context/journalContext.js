import React, { createContext, useEffect, useState } from "react";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [journalId, setJournalId] = useState(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [journalContent, setJournalContent] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState([]);

  // useEffect(() => {
  //   console.log("JOURNAL CONTEXT: ", journalId);
  // }, [journalId]);

  const toggleJournalPage = () => {
    // console.log("JOURNAL OPEN: ", journalOpen);
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
        editorOpen,
        setEditorOpen,
        journalContent,
        setJournalContent,
        filterOpen,
        setFilterOpen,
        filters,
        setFilters,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
