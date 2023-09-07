import React, { createContext, useEffect, useState } from "react";

// Create the ModalContext
export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [type, setType] = useState(null);
  const [deleteContext, setDeleteContext] = useState(null);

  useEffect(() => {
    console.log("MODAL TYPE: ", type);
  }, [type]);

  return (
    <ModalContext.Provider
      value={{
        type,
        setType,
        deleteContext,
        setDeleteContext,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
