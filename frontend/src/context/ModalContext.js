import React, { createContext, useEffect, useState } from "react";

// Create the ModalContext
export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [type, setType] = useState(null);
  const [deleteContext, setDeleteContext] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // console.log("MODAL TYPE: ", type);
  }, [type]);

  useEffect(() => {
    // console.log("DELETE CONTEXT: ", deleteContext);
  }, [deleteContext]);

  useEffect(() => {
    // console.log("DELETE ID: ", deleteId);
  }, [deleteId]);

  return (
    <ModalContext.Provider
      value={{
        type,
        setType,
        deleteContext,
        setDeleteContext,
        deleteId,
        setDeleteId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
