import React, { useState, useEffect, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { ModalContext } from "../../context/ModalContext";
import { PlaylistContext } from "../../context/playlistContext";
import { ThemeContext } from "../../context/themeContext";
import { createPlaylist, getAllPlaylists } from "../../store/playlists";
import spotifyIconGreen from "../../images/Spotify_Icon_RGB_Green.png";
import spotifyIcon from "../../images/Spotify_Icon_RGB_Black.png";
import { AiOutlineSearch } from "react-icons/ai";
import { ReactComponent as CloseIcon } from "../../images/icons/outline/close.svg";
import { ReactComponent as TrashIcon } from "../../images/icons/outline/trash.svg";
import { ReactComponent as PlayIcon } from "../../images/icons/outline/play.svg";
import PlaylistNavItem from "./PlaylistNavItem";
import { convertTime } from "../../utils/helper";

export default function PlaylistNav() {
  const dispatch = useDispatch();
  const { setPlaylistId, setPlaylistOpen, setShowPlaylist } =
    useContext(PlaylistContext);
  const { setType, setDeleteContext } = useContext(ModalContext);
  const { theme } = useContext(ThemeContext);
  const playlists = useSelector((state) => Object.values(state.playlists));
  const [searchInput, setSearchInput] = useState("");
  const [hoverId, setHoverId] = useState("null");

  const closeHandler = () => {
    setPlaylistOpen(false);
  };

  useEffect(() => {
    dispatch(getAllPlaylists());
  }, []);

  useEffect(() => {
    console.log("PLAYLIST HOVER ID: ", hoverId);
  }, [hoverId]);

  const sortedPlaylists = useMemo(() => {
    return playlists.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [playlists]);

  const createPlaylistHandler = async () => {
    console.log("CLICK CREATE PLAYLIST");
    const playlist = await dispatch(createPlaylist());
    setPlaylistId(playlist.playlist.id);
  };

  return (
    <div className="flex hover:cursor-default">
      <div className="flex flex-col bg-bkg-card relative py-4 rounded-l-3xl">
        <div className="px-4">
          <div className="flex flex-row justify-between text-txt-1 text-2xl font-semibold">
            <>Playlists</>
            <CloseIcon
              className="fill-txt-1 w-8 h-fit hover:cursor-pointer"
              onClick={closeHandler}
            />
          </div>
          <div className="p-4 relative flex items-center">
            <AiOutlineSearch className="text-xl absolute left-6" />
            <input
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder={"Search playlists..."}
              className="bg-bkg-button pl-8 p-2 w-full rounded-full  border-2 border-transparent outline-none focus:border-text-txt-hover caret-text-txt-hover"
            />
            <div className="flex justify-center px-3 text-white bottom-0">
              <button
                className="text-bkg-text hover:scale-105 hover:txt-hover w-fit h-fit p-1 font-bold "
                onClick={createPlaylistHandler}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className="text-bkg-text text-sm grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-1 border-b-[1px] border-b-bkg-nav relative">
            <div className="text-center">#</div>
            <div className="">Title</div>
            <div className="">Created At</div>
          </div>
        </div>
        <div className="journal-list px-4 max-w-[700px] min-w-[700px] h-full ">
          {sortedPlaylists ? (
            sortedPlaylists
              .filter((playlist) =>
                playlist.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((playlist, index) => (
                <div
                  className="grid grid-cols-[16px,4fr,3fr,0.5fr] gap-4 items-center px-4 py-2 border rounded border-transparent relative hover:bg-bkg-nav hover:cursor-pointer"
                  key={playlist.id}
                  onClick={() => {
                    setPlaylistId(playlist.id);
                    setShowPlaylist(true);
                  }}
                  onMouseEnter={(e) => setHoverId(playlist.id)}
                  onMouseLeave={(e) => setHoverId(null)}
                >
                  {hoverId === playlist.id ? (
                    <PlayIcon
                      className="w-6 h-fit m-0 fill-txt-hover  hover:cursor-pointer outline-none border-none"
                      data-tooltip-id="journal-tooltip"
                      data-tooltip-content="Play (ADD LATER)"
                    />
                  ) : (
                    <div className="text-center">{index + 1}</div>
                  )}
                  <div className="flex items-center w-full min-w-0">
                    <PlaylistNavItem songs={playlist.songs} />
                    <div className="flex items-center gap-y-[0.5px] px-2 w-full truncate">
                      <div className="truncate ">{playlist.name}</div>
                    </div>
                  </div>
                  <div className="text-bkg-text text-sm truncate">
                    {convertTime(playlist.createdAt)}
                  </div>{" "}
                  <div className="flex flex-row gap-x-2 items-center">
                    <div>
                      {theme === "dark" ? (
                        <img
                          src={spotifyIconGreen}
                          alt="spotify icon"
                          className="w-9"
                          data-tooltip-id="journal-tooltip"
                          data-tooltip-content="Open Spotify (ADD LATER)"
                        />
                      ) : (
                        <img
                          src={spotifyIcon}
                          alt="spotify icon"
                          className="w-9"
                          data-tooltip-id="journal-tooltip"
                          data-tooltip-content="Open Spotify (ADD LATER)"
                        />
                      )}
                    </div>
                    <TrashIcon
                      className="w-10 h-fit ml-3 m-0 fill-txt-hover hover:cursor-pointer outline-none border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setType("DELETE");
                        setDeleteContext("PLAYLIST");
                      }}
                      data-tooltip-id="playlist-tooltip"
                      data-tooltip-content="Delete Playlist"
                    />
                  </div>
                </div>
              ))
          ) : (
            <div className="flex h-full items-center justify-center text-xl">
              NO MATCHING JOURNALS FOUND
            </div>
          )}
        </div>
        <Tooltip
          className="z-10"
          place="top"
          type="dark"
          effect="solid"
          id="playlist-tooltip"
        />
      </div>
    </div>
  );
}
