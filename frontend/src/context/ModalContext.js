import React, { createContext, useState } from "react";

// Create the ModalContext
const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [type, setType] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        type,
        setType,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
