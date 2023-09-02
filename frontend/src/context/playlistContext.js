import React, { createContext, useEffect, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  useEffect(() => {
    console.log("PLAYLIST CONTEXT: ", playlist);
  }, [playlist]);

  const togglePlaylistPage = () => {
    console.log("PLAYLIST OPEN: ", playlistOpen);
    setPlaylistOpen(!playlistOpen);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        setPlaylist,
        setPlaylistOpen,
        togglePlaylistPage,
        playlistOpen,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
