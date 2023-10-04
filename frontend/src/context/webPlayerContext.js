import React, { createContext, useContext, useEffect, useState } from "react";
import { HowlerContext } from "./howlerContext";

export const WebPlayerContext = createContext();

export const WebPlayerProvider = ({ children }) => {
  const { isPlaying, setIsPlaying } = useContext(HowlerContext);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [playlistUris, setPlaylistUris] = useState([]);
  const [resetPlaylist, setResetPlaylist] = useState(false);

  const playSong = (songId) => {
    setCurrentSongId(songId);
    setIsPlaying(true);
  };

  const handlePlaylist = (songId, playlist) => {
    setCurrentSongId(songId);
    const songUri = `spotify:track:${songId}`;
    console.log("Playlist: ", playlist);
    if (playlist.length > 1) {
      setPlaylistUris(playlist);
      // const songUri = `spotify:track:${songId}`;
      // const songIndex = playlistUris.findIndex((uri) => uri === songUri);
      // const reorderedUris = [
      //   songUri,
      //   ...playlistUris.slice(songIndex + 1),
      //   ...playlistUris.slice(0, songIndex),
      // ];
      // setPlaylistUris(reorderedUris);
    } else {
      setPlaylistUris([songUri]);
    }
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
        resetPlaylist,
        setResetPlaylist,
      }}
    >
      {children}
    </WebPlayerContext.Provider>
  );
};
