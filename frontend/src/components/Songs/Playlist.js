import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  resetPlaylistAction,
} from "../../store/playlists";
import { debounce } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { JournalContext } from "../../context/journalContext";
import { PlaylistContext } from "../../context/playlistContext";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

export default function Playlist() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
  const { journal } = useContext(JournalContext);
  const playlist = useSelector((state) => state.playlist[playlistId]);
  const playlistSongs = playlist?.songs ? Object.values(playlist.songs) : [];
  const [title, setTitle] = useState("");
  const debouncedUpdate = useRef(
    debounce((playlistId, title) => {
      console.log("ARGS: ", playlistId, title);
      dispatch(updatePlaylist(playlistId, { name: title }));
    }, 500)
  ).current;

  useEffect(() => {
    console.log("PLAYLIST: ", playlist);
    if (playlistId) {
      setTitle(playlist?.name || "asdf");
    } else {
      dispatch(resetPlaylistAction());
    }
  }, [playlistId]);

  return (
    playlist && (
      <div className="flex flex-col flex-grow w-full my-2 max-h-[50%] bg-baby-powder rounded-3xl">
        <div className="flex flex-row justify-center">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
              debouncedUpdate(playlistId, e.target.value);
            }}
            value={title}
            className="p-3 border-none rounded-3xl focus:outline-none font-semibold w-full"
          />
        </div>
        <div className="flex flex-row items-center header-row border-b-[1px] border-b-[#cccccc]">
          <div className="mx-2 text-center">#</div>
          <div className="flex flex-1 items-start">
            <div className="ml-2">Title</div>
          </div>
          <div className="flex-1">Album</div>
        </div>
        <div className="playlist flex flex-col my-3 overflow-y-auto gap-y-2">
          {playlistSongs &&
            playlistSongs.map((song, index) => (
              <div className="flex flex-row" key={song.id} data-id={song.id}>
                <div className="mx-3 text-center">{index + 1}</div>
                <div className="flex flex-1 items-start">
                  <img
                    src={
                      "https://i.scdn.co/image/ab67616d00001e02a1214ad1ca57685349932cea"
                    }
                    alt="Album Cover"
                    className="w-20 h-20 mr-3"
                  />
                  <div className="flex flex-col gap-y-1">
                    <div>
                      Be Who You Are (Real Magic) (feat. JID, NewJeans & Camilo)
                    </div>
                    <div className="">
                      Jon Batiste ft. JID, NewJeans, Camilo
                    </div>
                  </div>
                </div>
                <div className="flex-1 ml-10">Be Who You Are (Real Magic)</div>
                <button className="flex mr-5 ">
                  <IoRemoveCircleOutline className="text-xl" />
                </button>
              </div>
            ))}
        </div>
      </div>
    )
  );
}
