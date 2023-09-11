import React, { useRef } from "react";
import Playlist from "../Playlist/Playlist";
import SongRecs from "./SongRecs";
import { useDraggable } from "react-use-draggable-scroll";

export default function SongsContainer() {
  const containerRef = useRef(null);

  const { events } = useDraggable(containerRef);

  const handleScroll = (event) => {
    if (event.deltaY !== 0) {
      containerRef.current.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleScroll}
      {...events}
      className="flex flex-col songs-container h-full w-full justify-center overflow-scroll relative select-none>"
    >
      <SongRecs />
    </div>
  );
}
