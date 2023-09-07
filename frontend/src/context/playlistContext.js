import React, { createContext, useEffect, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [isSongRecsShown, setIsSongRecsShown] = useState(false);

  useEffect(() => {
    console.log("PLAYLIST CONTEXT: ", playlistId);
  }, [playlistId]);

  useEffect(() => {
    console.log("SONGREC CONTEXT: ", isSongRecsShown);
  }, [isSongRecsShown]);

  const togglePlaylist = () => {
    console.log("PLAYLIST OPEN: ", playlistOpen);
    setPlaylistOpen(!playlistOpen);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlistId,
        setPlaylistId,
        isSongRecsShown,
        setIsSongRecsShown,
        playlistOpen,
        setPlaylistOpen,
        togglePlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
