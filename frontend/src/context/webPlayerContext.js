import React, { createContext, useContext, useEffect, useState } from "react";
import { HowlerContext } from "./howlerContext";

export const WebPlayerContext = createContext();

export const WebPlayerProvider = ({ children }) => {
  const { isPlaying, setIsPlaying } = useContext(HowlerContext);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [playlistUris, setPlaylistUris] = useState([]);

  const playSong = (songId) => {
    setCurrentSongId(songId);
    setIsPlaying(true);
  };

  const handlePlaylist = (songId) => {
    setCurrentSongId(songId);
    const songUri = `spotify:track:${songId}`;
    const songIndex = playlistUris.findIndex((uri) => uri === songUri);

    // if (songIndex === -1) return;
    // console.log("PLAYLIST URIS BEFORE: ", playlistUris);

    if (playlistUris.length > 1) {
      const reorderedUris = [
        songUri,
        ...playlistUris.slice(songIndex + 1),
        ...playlistUris.slice(0, songIndex),
      ];
      setPlaylistUris(reorderedUris);
    }

    setIsPlaying(true);
    console.log("CURRENT PLAYLIST: ", playlistUris);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    console.log("CURRENT SONG: ", currentSongId);
  }, [currentSongId]);

  useEffect(() => {
    console.log("PLAYLIST URIS: ", playlistUris);
  }, [playlistUris]);

  return (
    <WebPlayerContext.Provider
      value={{
        currentSongId,
        setCurrentSongId,
        playlistUris,
        setPlaylistUris,
        playSong,
        pauseSong,
        handlePlaylist,
      }}
    >
      {children}
    </WebPlayerContext.Provider>
  );
};
