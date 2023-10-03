import React, { createContext, useContext, useEffect, useState } from "react";
import { HowlerContext } from "./howlerContext";

export const WebPlayerContext = createContext();

export const WebPlayerProvider = ({ children }) => {
  const { isPlaying, setIsPlaying } = useContext(HowlerContext);
  const [currentSongId, setCurrentSongId] = useState(null);

  const playSong = (songId) => {
    setCurrentSongId(songId);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    console.log("CURRENT SONG: ", currentSongId);
  }, [currentSongId]);

  return (
    <WebPlayerContext.Provider
      value={{ currentSongId, setCurrentSongId, playSong, pauseSong }}
    >
      {children}
    </WebPlayerContext.Provider>
  );
};
