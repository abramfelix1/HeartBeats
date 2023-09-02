import React from "react";
import {
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../../store/playlists";
import { useDispatch, useSelector } from "react-redux";

export default function Playlist() {
  const dispatch = useDispatch();
  const playlist = useSelector((state) => Object.values(state.playlist));

  return (
    <div className="flex flex-col mb-2 h-full bg-baby-powder rounded-3xl">
      <div>
        <p>Playlist name</p>
      </div>
    </div>
  );
}
