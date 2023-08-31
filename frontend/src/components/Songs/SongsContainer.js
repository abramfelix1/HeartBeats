import React from "react";
import Playlist from "./Playlist";
import SongRecs from "./SongRecs";

export default function SongsContainer() {
  return (
    <div className="flex flex-col mr-2 my-2 w-[50%]">
      {/* <Playlist /> */}
      <SongRecs />
    </div>
  );
}
