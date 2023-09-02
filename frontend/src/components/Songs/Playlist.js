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
      console.log("PLAYLIST: ", playlist);
    } else {
      dispatch(resetPlaylistAction());
    }
  }, [playlistId, journal]);

  return (
    playlist && (
      <div className="flex flex-col mb-2 h-full bg-baby-powder rounded-3xl">
        <div>
          <p>{playlist.id}</p>
        </div>
      </div>
    )
  );
}
