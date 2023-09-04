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
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";

export default function Playlist() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
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
    } else {
      dispatch(resetPlaylistAction());
    }
  }, [playlistId]);

  return (
    playlist && (
      <div className="bg-bkg-card flex flex-col flex-grow w-full mb-2 max-h-[50%] rounded-3xl">
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
        <div className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-x-4 items-center px-4 border-b-[1px] border-b-[#cccccc]">
          <div className="text-center">#</div>
          <div className="ml-2">Title</div>
          <div className="">Album</div>
          <div></div>
        </div>
        <div className="playlist overflow-y-auto gap-y-2 grid">
          {playlistSongs &&
            playlistSongs.map((song, index) => (
              <div
                className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 border rounded h-14 border-transparent relative"
                key={song.id}
                data-id={song.id}
              >
                <div className="text-center">{index + 1}</div>
                <div className="flex items-start items-center w-full min-w-0">
                  <img
                    src={
                      "https://i.scdn.co/image/ab67616d00001e02a1214ad1ca57685349932cea"
                    }
                    alt="Album Cover"
                    className="w-10 h-10 mr-3"
                  />
                  <div className="flex flex-col gap-y-1 pr-2 w-full truncate">
                    <div className="truncate ">
                      Be Who You Are (Real Magic) (feat. JID, NewJeans & Camilo)
                    </div>
                    <div className="truncate ">
                      Jon Batiste ft. JID, NewJeans, Camilo
                    </div>
                  </div>
                </div>
                <div className="truncate">
                  {" "}
                  Be Who You Are (Real Magic) (feat. JID, NewJeans & Camilo)
                </div>
                <button className="flex justify-end mr-5">
                  <IoRemoveCircleOutline className="text-xl" />
                </button>
              </div>
            ))}
        </div>
      </div>
    )
  );
}
