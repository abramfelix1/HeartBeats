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
import { PlaylistContext } from "../../context/playlistContext";
import { ThemeContext } from "../../context/themeContext";

function Navigation({ isLoaded, navHovered, ...props }) {
  const dispatch = useDispatch();
  const { toggleJournalPage, setJournalOpen, setJournalId } =
    useContext(JournalContext);
  const { setPlaylistId } = useContext(PlaylistContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const { theme, toggleDark } = useContext(ThemeContext);

  const logoutClickHandler = () => {
    dispatch(logout());
    dispatch(resetJournalsActions());
    setJournalOpen(false);
    setJournalId(null);
    setPlaylistId(null);
  };

  const collapseClickHandler = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`bg-bkg-nav flex flex-col ml-2 my-2 mr-2 items-center relative rounded-3xl ${
        isCollapsed ? "px-1" : "px-1"
      }
      `}
      {...props}
    >
      <button
        className="bg-bkg-nav absolute h-[85%] w-[5px] right-0  top-[7.5%] rounded-3xl opacity-0 user-select: none hover:opacity-0 "
        onClick={collapseClickHandler}
      />
      <div className="flex flex-col flex-grow justify center items-center">
        <NavLink exact to="/" className="py-5">
          <img
            src={logo}
            alt="logo"
            className={`${isCollapsed ? "w-[50px]" : "w-[75px]"}`}
          />
        </NavLink>
        <div className="space-y-8 my-8">
          {sessionUser && (
            <div
              className="flex gap-x-2 justify-center items-center hover:cursor-pointer"
              data-tooltip-id="nav-tooltip"
              data-tooltip-content="Profile"
            >
              <AiOutlineUser className="text-[35px]" />
              {!isCollapsed && <p className="select-none">Profile</p>}
            </div>
          )}
          {sessionUser && (
            <div
              className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
              data-tooltip-id="nav-tooltip"
              data-tooltip-content="Journal"
              onClick={toggleJournalPage}
            >
              <AiOutlineEdit className="text-[35px]" />
              {!isCollapsed && <p className="select-none">Journal</p>}
            </div>
          )}
          {sessionUser && (
            <div
              className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
              data-tooltip-id="nav-tooltip"
              data-tooltip-content="Music"
            >
              <PiMusicNotes className="text-[35px]" />
              {!isCollapsed && <p className="select-none">Music</p>}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-8 mb-5">
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
                  className="mode-checkbox opacity-0 absolute"
                  onChange={toggleDark}
                  checked={theme === "dark"}
                />
                <label
                  for="check"
                  className="mode-label relative flex justify-between items-center p-[5px] h-[26px] w-[60px] bg-bkg-card rounded-2xl cursor-pointer"
                >
                  <FaRegMoon className=" text-bkg-text" />
                  <BsFillBrightnessHighFill className=" text-bkg-text" />
                  <div className="mode-ball absolute bg-bkg-text top-[2px] left-[2px] w-[22px] h-[22px] rounded-full translate-x-0 transition-transform duration-150 ease-linear"></div>
                </label>
              </>
            )}
            {!isCollapsed && <p className="select-none">Theme</p>}
          </div>
        )}
        {sessionUser && (
          <div
            className="flex gap-x-2 justify-center items-center  hover:cursor-pointer"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Settings"
          >
            {isLoaded && <AiOutlineSetting className="text-[35px]" />}
            {!isCollapsed && <p className="select-none">Settings</p>}
          </div>
        )}
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
            <MdOutlineLogout className="text-[35px]" />
            {!isCollapsed && <p className="select-none">Logout</p>}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex gap-x-2 justify-center items-center"
            data-tooltip-id="nav-tooltip"
            data-tooltip-content="Login"
          >
            <MdOutlineLogin className="text-[35px]" />
            {!isCollapsed && <p className="select-none">Login</p>}
          </NavLink>
        )}
      </div>
      {isCollapsed && (
        <Tooltip
          className="mx-1 z-10"
          place="right"
          type="dark"
          effect="solid"
          id="nav-tooltip"
        />
      )}
    </div>
  );
}

export default Navigation;
