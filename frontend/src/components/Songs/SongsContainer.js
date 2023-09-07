import React from "react";
import Playlist from "../Playlist/Playlist";
import SongRecs from "./SongRecs";

export default function SongsContainer() {
  return (
    <div className="songs-container flex flex-col w-[50%] mr-2 mt-2">
      <Playlist />
      <SongRecs />
    </div>
  );
}
