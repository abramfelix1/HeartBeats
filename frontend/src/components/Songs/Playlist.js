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
        <div className="py-4">
          <p>{playlist.name}</p>
          <p>{playlist.id}</p>
        </div>
        <div className="flex flex-row items-center header-row">
          <div className="w-7 text-center">#</div>
          <div className="flex flex-1 items-start">
            <div className="ml-3">Title</div>
          </div>
          <div className="flex-1">Album</div>
        </div>
        <div className="playlist flex flex-col my-2 overflow-y-auto gap-y-2">
          {playlistSongs &&
            playlistSongs.map((song, index) => (
              <div
                className="flex flex-row items-center"
                key={song.id}
                data-id={song.id}
              >
                <div className="w-10 text-center">{index + 1}</div>
                <div className="flex flex-1 items-start">
                  <img
                    src={"https://i.imgur.com/0OXyb26.jpeg"}
                    alt="Album Cover"
                    className="w-14 h-14 mr-5"
                  />
                  <div className="flex flex-col gap-y-1">
                    <div>{song.name}</div>
                    <div className="song-artist">{song.artists}</div>
                  </div>
                </div>
                <div className="flex-1">{song.album}</div>
              </div>
            ))}
        </div>
      </div>
    )
  );
}
