import React, { useContext, useEffect } from "react";
import {
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  resetPlaylistAction,
} from "../../store/playlists";
import { useDispatch, useSelector } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { PlaylistContext } from "../../context/playlistContext";

export default function Playlist() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
  const { journal } = useContext(JournalContext);
  const playlist = useSelector((state) => state.playlist.playlist);

  useEffect(() => {
    if (playlistId) {
      console.log("PLAYLIST PLAYLIST ID:, ", playlistId);
      dispatch(getPlaylist(playlistId));
    } else {
      dispatch(resetPlaylistAction());
    }
  }, [playlistId]);

  return (
    playlist && (
      <div className="flex flex-col mb-2 h-full bg-baby-powder rounded-3xl">
        <div className="flex justify-center w-full">
          <p>{playlist.name}</p>
          <p>{playlist.id}</p>
        </div>
      </div>
    )
  );
}
