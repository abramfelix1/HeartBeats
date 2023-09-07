import React from "react";
import Playlist from "../Playlist/Playlist";
import SongRecs from "./SongRecs";

export default function SongsContainer() {
  return (
    <div className="songs-container h-full flex items-center overflow-scroll">
      <SongRecs />
    </div>
  );
}
