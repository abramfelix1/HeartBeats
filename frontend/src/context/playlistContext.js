import React, { createContext, useEffect, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [isSongRecsShown, setIsSongRecsShown] = useState(false);

  useEffect(() => {
    console.log("PLAYLIST CONTEXT: ", playlistId);
  }, [playlistId]);

  useEffect(() => {
    console.log("SONGREC CONTEXT: ", isSongRecsShown);
  }, [isSongRecsShown]);

  return (
    <PlaylistContext.Provider
      value={{
        playlistId,
        setPlaylistId,
        isSongRecsShown,
        setIsSongRecsShown,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
