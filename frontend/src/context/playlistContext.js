import React, { createContext, useEffect, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isSongRecsShown, setIsSongRecsShown] = useState(true);

  useEffect(() => {
    // console.log("PLAYLIST CONTEXT: ", playlistId);
  }, [playlistId]);

  useEffect(() => {
    // console.log("SONGREC CONTEXT: ", isSongRecsShown);
  }, [isSongRecsShown]);

  useEffect(() => {
    // console.log("SHOW PLAYIST CONTEXT: ", isSongRecsShown);
  }, [showPlaylist]);

  const togglePlaylist = () => {
    // console.log("PLAYLIST OPEN: ", playlistOpen);
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
        showPlaylist,
        setShowPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
