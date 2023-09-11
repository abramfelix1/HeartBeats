import React, { useContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { PiMusicNotes } from "react-icons/pi";
import { JournalContext } from "../../context/journalContext";
import { resetJournalsActions } from "../../store/journals";
import { resetPlaylistAction } from "../../store/playlists";
import { PlaylistContext } from "../../context/playlistContext";
import { ThemeContext } from "../../context/themeContext";
import { ReactComponent as JournalIcon } from "../../images/icons/outline/journal.svg";
import { ReactComponent as PlaylistIcon } from "../../images/icons/outline/playlist-folder.svg";
import { ReactComponent as SettingsIcon } from "../../images/icons/outline/cog.svg";
import { ReactComponent as LogInIcon } from "../../images/icons/outline/login.svg";
import { ReactComponent as LogOutIcon } from "../../images/icons/outline/logout.svg";
import { ReactComponent as SunIcon } from "../../images/icons/outline/sun.svg";
import { ReactComponent as MoonIcon } from "../../images/icons/outline/moon.svg";
import { resetRecSongsAction } from "../../store/spotify";

function Navigation({ isLoaded, navHovered, ...props }) {
  const dispatch = useDispatch();
  const {
    toggleJournalPage,
    setJournalOpen,
    setJournalId,
    setEditorOpen,
    setFilterOpen,
  } = useContext(JournalContext);
  const { setPlaylistId, togglePlaylist } = useContext(PlaylistContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user.id : null
  );
  const { theme, toggleDark } = useContext(ThemeContext);

  const logoutClickHandler = () => {
    dispatch(logout());
    dispatch(resetJournalsActions());
    dispatch(resetRecSongsAction());
    dispatch(resetPlaylistAction());
    setJournalOpen(false);
    setJournalId(null);
    setPlaylistId(null);
    setEditorOpen(false);
    setFilterOpen(false);
  };

  const collapseClickHandler = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className=" flex w-full justify-end absolute z-[1]">
      <div className="bg-bgk-card flex flex-row items center gap-3 h-fit w-fit p-2 rounded-lg m-4">
        {sessionUser && (
          <div
            className=" flex gap-x-2 justify-center items-center  hover:cursor-pointer"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Journals"
            onClick={toggleJournalPage}
          >
            <JournalIcon className="w-12 fill-txt-1 hover:scale-105" />
          </div>
        )}
        {sessionUser && (
          <div
            className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Playlists"
            onClick={togglePlaylist}
          >
            <PlaylistIcon className="w-12 fill-txt-1 hover:scale-105" />
          </div>
        )}
        {sessionUser && (
          <div
            className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Set Theme"
          >
            {isLoaded && (
              <>
                {" "}
                <input
                  type="checkbox"
                  id="check"
                  className="mode-checkbox opacity-0 absolute hover:scale-105"
                  onChange={toggleDark}
                  checked={theme === "dark"}
                />
                <label
                  for="check"
                  className="mode-label relative flex justify-between items-center p-1 h-12 w-[48px] rounded-lg border-2 border-txt-1 cursor-pointer hover:scale-105"
                >
                  <MoonIcon className="w-8 fill-txt-1" />
                  <SunIcon className="w-8 fill-txt-1" />
                  <div
                    className={`mode-ball absolute bg-txt-1 left-[0px] w-[50%] h-full translate-x-0 transition-transform duration-150 ease-linear ${
                      theme === "dark" ? "rounded-r-md" : "rounded-l-md"
                    } `}
                  ></div>
                </label>
              </>
            )}
          </div>
        )}
        {/* {sessionUser && (
          <div
            className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Settings"
          >
            <SettingsIcon className="w-12 fill-txt-1 hover:scale-105" />
          </div>
        )} */}
        {sessionUser ? (
          <div
            className="flex gap-x-2 justify-center items-center hover:cursor-pointer"
            onClick={() => {
              logoutClickHandler();
              collapseClickHandler();
            }}
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Logout"
          >
            <LogOutIcon className="w-12 fill-txt-1 hover:scale-105" />
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex gap-x-2 justify-center items-center"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Login"
          >
            <LogInIcon className="w-12 fill-txt-1 hover:scale-105" />
          </NavLink>
        )}
      </div>
      <Tooltip
        className="z-10"
        place="bottom"
        type="dark"
        effect="solid"
        id="nav-tooltip"
      />
    </div>
  );
}

export default Navigation;
