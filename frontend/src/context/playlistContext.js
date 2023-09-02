import React, { createContext, useEffect, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    console.log("PLAYLIST CONTEXT: ", playlistId);
  }, [playlistId]);

  return (
    <PlaylistContext.Provider
      value={{
        playlistId,
        setPlaylistId,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
