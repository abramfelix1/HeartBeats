import React, { useContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { PiMusicNotes } from "react-icons/pi";
import { JournalContext } from "../../context/journalContext";
import { resetJournalsActions } from "../../store/journals";
import { PlaylistContext } from "../../context/playlistContext";

function Navigation({ isLoaded, navHovered, ...props }) {
  const dispatch = useDispatch();
  const { toggleJournalPage, setJournalOpen, setJournalId } =
    useContext(JournalContext);
  const { setPlaylistId } = useContext(PlaylistContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

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
      className={`flex flex-col ml-2 my-2 mr-2 items-center text-[#33658A] relative rounded-3xl ${
        isCollapsed ? "px-3" : "px-3"
      }
      ${sessionUser ? "bg-baby-powder" : "bg-baby-powder"}
      `}
      {...props}
    >
      <button
        className="bg-black absolute h-[85%] w-[5px] right-0  top-[7.5%] rounded-3xl opacity-0 user-select: none hover:opacity-0 "
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
