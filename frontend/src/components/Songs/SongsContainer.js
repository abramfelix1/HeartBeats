import React from "react";
import Playlist from "../Playlist/Playlist";
import SongRecs from "./SongRecs";

export default function SongsContainer() {
  return (
    <div className="flex flex-col songs-container h-full w-full justify-center overflow-scroll relative">
      <SongRecs />
    </div>
  );
}
