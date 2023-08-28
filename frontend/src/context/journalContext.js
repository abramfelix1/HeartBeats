import React, { createContext, useEffect, useState } from "react";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [journal, setJournal] = useState(null);

  useEffect(() => {
    console.log("JOURNAL CONTEXT: ", journal);
  }, [journal]);

  return (
    <JournalContext.Provider
      value={{
        journal,
        setJournal,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
