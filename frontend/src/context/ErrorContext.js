import React, { createContext, useEffect, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    console.log("ERRORS CONTEXT: ", errors);
  }, [errors]);

  return (
    <ErrorContext.Provider
      value={{
        errors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
