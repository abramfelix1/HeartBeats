import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  resetPlaylistAction,
  removeSongFromPlaylist,
} from "../../store/playlists";
import { useDispatch, useSelector } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { PlaylistContext } from "../../context/playlistContext";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";

export default function Playlist() {
  const dispatch = useDispatch();
  const { playlistId, isSongRecsShown, setIsSongRecsShown } =
    useContext(PlaylistContext);
  const { journal } = useContext(JournalContext);
  const playlist = useSelector((state) => state.playlist[playlistId]);
  const playlistSongs = playlist?.songs ? Object.values(playlist.songs) : [];
  const [title, setTitle] = useState("");
  const { setErrors } = useContext(ErrorContext);
  const { setType } = useContext(ModalContext);

  const handleBlur = () => {
    dispatch(updatePlaylist(playlistId, { name: title })).catch(async (res) => {
      const data = await res.json();
      console.log(data.errors);
      setErrors(data.errors);
      setType("ERROR");
      setTitle(playlist.name);
    });
  };

  useEffect(() => {
    console.log("PLAYLIST: ", playlist);
    if (playlistId) {
      setTitle(playlist?.name || "asdf");
    }
  }, [playlistId]);

  const removeSongHandler = (songId) => {
    dispatch(removeSongFromPlaylist(playlistId, songId));
  };

  return (
    playlist && (
      <div
        className={`bg-bkg-card flex flex-col flex-grow basis-[10%] w-full mb-2  rounded-3xl cursor-default overflow-y-auto
      `}
      >
        <div className="flex flex-row justify-center">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
              // debouncedUpdate(playlistId, e.target.value);
            }}
            onBlur={handleBlur}
            value={title}
            className="bg-bkg-card p-3 border-none rounded-3xl focus:outline-none font-semibold w-full"
          />
        </div>
        <div className="text-bkg-text text-sm grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-1 border-b-[1px] border-b-bkg-nav relative">
          <div className="text-center">#</div>
          <div className="">Title</div>
          <div className="">Album</div>
        </div>
        <div className="playlist overflow-y-auto gap-y-2 grid mb-4">
          {playlistSongs &&
            playlistSongs.map((song, index) => (
              <div
                className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 border rounded h-14 border-transparent relative"
                key={song.id}
                // data-id={song.id}
              >
                <div className="text-center">{index + 1}</div>
                <div className="flex items-center w-full min-w-0">
                  <img
                    src={song.img_url}
                    alt="Album Cover"
                    className="w-10 h-10 mr-3"
                  />
                  <div className="flex flex-col gap-y-[0.5px] pr-2 w-full truncate">
                    <div className="truncate ">{song.name}</div>
                    <div className="text-bkg-text text-sm truncate">
                      {song.artists}
                    </div>
                  </div>
                </div>
                <div className="text-bkg-text text-sm truncate">
                  {song.album}
                </div>
                <button className="flex justify-end mr-5">
                  <IoRemoveCircleOutline
                    className="text-bkg-text text-lg hover:text-txt-hover hover:scale-105"
                    onClick={() => {
                      removeSongHandler(song.id);
                    }}
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
    )
  );
}
