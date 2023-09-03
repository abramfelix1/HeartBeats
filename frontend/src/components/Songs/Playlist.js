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
  const playlistSongs = playlist?.songs ? Object.values(playlist.songs) : [];

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
      <div className="flex flex-col flex-grow w-full my-2 max-h-[50%] bg-baby-powder rounded-3xl">
        <div className="flex flex-col justify-center overflow-y-auto">
          <p>{playlist.name}</p>
          <p>{playlist.id}</p>
          {playlistSongs &&
            playlistSongs.map((song) => (
              <div>
                <></>
                {song.name}
              </div>
            ))}
        </div>
      </div>
    )
  );
}
