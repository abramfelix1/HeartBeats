import React from "react";

export default function PlaylistNavItem({ songs }) {
  console.log("PLAYLIST SONGs", songs);

  const getNumColumns = (count) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1";
      case 3:
        return "grid-cols-1";
      case 4:
      default:
        return "grid-cols-2";
    }
  };

  const getNumSongs = (songs) => {
    if (songs.length < 4) {
      return 1;
    } else {
      return Math.min(4, songs.length);
    }
  };

  return songs.length ? (
    <div
      className={`grid ${getNumColumns(
        songs.length
      )} max-w-[40px] max-h-[40px]`}
    >
      {songs.slice(0, getNumSongs(songs)).map((song, index) => (
        <div key={index} className="bg-black relative hover:cursor-default">
          <img
            src={song.img_url}
            alt={`Album cover for ${song.name}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="max-w-[40px] max-h-[40px]">Hi</div>
  );
}
