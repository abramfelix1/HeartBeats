import React from "react";
import PlaylistNav from "./PlaylistNav";

export default function PlaylistContainer() {
  return (
    <div className="flex right-0 h-full rounded-[100px] absolute z-[2]">
      <PlaylistNav />
    </div>
  );
}
