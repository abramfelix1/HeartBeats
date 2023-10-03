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
import { Tooltip } from "react-tooltip";
import { JournalContext } from "../../context/journalContext";
import { PlaylistContext } from "../../context/playlistContext";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { ErrorContext } from "../../context/ErrorContext";
import { ModalContext } from "../../context/ModalContext";
import { ReactComponent as CloseIcon } from "../../images/icons/outline/close.svg";
import { ReactComponent as PlayIcon } from "../../images/icons/outline/play.svg";
import { ReactComponent as StopIcon } from "../../images/icons/outline/stop.svg";
import { ReactComponent as ArrowIcon } from "../../images/icons/outline/arrow.svg";
import { HowlerContext } from "../../context/howlerContext";
import { WebPlayerContext } from "../../context/webPlayerContext";

export default function Playlist() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [hoverId, setHoverId] = useState("null");
  const { playlistId, setPlaylistId, setPlaylistOpen, setShowPlaylist } =
    useContext(PlaylistContext);
  const { setCurrentSongId, currentSongId, playSong, pauseSong } =
    useContext(WebPlayerContext);
  const { journal } = useContext(JournalContext);
  const { errors, setErrors } = useContext(ErrorContext);
  const { setType } = useContext(ModalContext);
  const {
    stopSound,
    playSound,
    remainingTime,
    currentPlaying,
    isPlaying,
    setIsPlaying,
  } = useContext(HowlerContext);
  const playlist = useSelector((state) => state.playlists[playlistId]);
  const playlistSongs = playlist?.songs ? Object.values(playlist.songs) : [];
  const sessionSpotify = useSelector((state) =>
    state.session.user.spotifyId ? state.session.user.spotifyId : null
  );

  const closeHandler = () => {
    setShowPlaylist(false);
    setPlaylistOpen(true);
    setPlaylistId(null);
  };

  const handleBlur = () => {
    if (title.trim().length < 1) {
      setErrors({ playlist: "Playlist name cannot be empty" });
      setType("ERROR");
      setTitle(playlist.name);
      console.log("PLAYLIST NAME:", playlist.name);
    } else {
      dispatch(updatePlaylist(playlistId, { name: title })).catch(
        async (res) => {
          const data = await res.json();
          console.log(data.errors);
          setErrors(data.errors);
          setType("ERROR");
          setTitle(playlist.name);
          console.log(playlist.name);
        }
      );
    }
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
        className={`py-4 bg-bkg-card flex flex-col flex-grow w-full   rounded-l-3xl cursor-default overflow-y-auto
      `}
      >
        <div className="px-4">
          <div className="flex flex-row items-center justify-between text-txt-1 text-2xl font-medium">
            <input
              onChange={(e) => {
                setTitle(e.target.value);
                // debouncedUpdate(playlistId, e.target.value);
              }}
              onBlur={handleBlur}
              value={title}
              className="bg-bkg-card border-none focus:outline-none  w-[80%]"
            />
            <ArrowIcon
              className="fill-txt-1 w-10 h-fit hover:cursor-pointer hover:scale-110"
              onClick={() => {
                handleBlur();
                closeHandler();
              }}
            />
          </div>
          <div className="text-bkg-text text-sm grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-1 pt-4 border-b-[1px] border-b-bkg-nav relative">
            <div className="text-center">#</div>
            <div className="">Title</div>
            <div className="">Album</div>
          </div>
          <div className="playlist overflow-y-auto gap-y-2 grid p-4">
            {playlistSongs &&
              playlistSongs.map((song, index) => (
                <div
                  className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center border rounded h-14 border-transparent relative hover:bg-bkg-nav hover:cursor-pointer"
                  key={song.id}
                  // data-id={song.id}
                  onMouseEnter={(e) => setHoverId(song.id)}
                  onMouseLeave={(e) => setHoverId(null)}
                >
                  {hoverId === song.id && song?.preview ? (
                    <>
                      <button
                        onClick={() => {
                          if (isPlaying && currentPlaying === index) {
                            stopSound();
                          } else {
                            if (sessionSpotify) {
                              setCurrentSongId(song.spotifyId);
                              setIsPlaying(true);
                            } else playSound(song.preview, index);
                          }
                        }}
                      >
                        <div>
                          {isPlaying && currentPlaying === index ? (
                            <StopIcon
                              className="w-6 h-fit m-0 fill-txt-hover  hover:cursor-pointer outline-none border-none hover:scale-105"
                              data-tooltip-id="playlist-tooltip"
                              data-tooltip-content="Play (ADD LATER)"
                            />
                          ) : (
                            <PlayIcon
                              className="w-6 h-fit m-0 fill-txt-hover  hover:cursor-pointer outline-none border-none hover:scale-105"
                              data-tooltip-id="playlist-tooltip"
                              data-tooltip-content="Play Preview"
                            />
                          )}
                        </div>
                      </button>
                    </>
                  ) : (
                    <div className="text-center">{index + 1}</div>
                  )}
                  <div className="flex items-center w-full min-w-0">
                    <img
                      src={song.img_url}
                      alt="Album Cover"
                      className="w-12 h-12 mr-3"
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
                      data-tooltip-id="playlist-tooltip"
                      data-tooltip-content="Remove Song"
                    />
                  </button>
                </div>
              ))}
          </div>
          <Tooltip
            className="z-[100]"
            place="top"
            type="dark"
            effect="solid"
            id="playlist-tooltip"
          />
        </div>
      </div>
    )
  );
}
