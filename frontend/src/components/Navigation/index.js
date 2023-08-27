import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { logout } from "../../store/session";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { PiMusicNotes, PiUser } from "react-icons/pi";

function Navigation({ isLoaded, navHovered, ...props }) {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  const logoutClickHandler = () => {
    dispatch(logout());
  };

  const collapseClickHandler = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col ml-2 my-2 items-center text-[#33658A] relative rounded-3xl ${
        isCollapsed ? "px-2" : "px-5"
      }
      ${sessionUser ? "bg-[#FFFFFC]" : ""}
      `}
      {...props}
    >
      <button
        className="bg-black absolute h-full w-[1px] right-0 opacity-0"
        onClick={collapseClickHandler}
      >
        {/* {isCollapsed ? "Expand" : "Collapse"} */}
      </button>
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
            <div className="flex gap-x-2 justify-center items-center hover:cursor-pointer">
              <AiOutlineUser className="text-[35px]" />
              {!isCollapsed && <p>Profile</p>}
            </div>
          )}
          {sessionUser && (
            <div className="flex gap-x-2 justify-center items-center  hover:cursor-pointer">
              {isLoaded && <AiOutlineEdit className="text-[35px]" />}
              {!isCollapsed && <p>Journal</p>}
            </div>
          )}
          {sessionUser && (
            <div className="flex gap-x-2 justify-center items-center  hover:cursor-pointer">
              {isLoaded && <PiMusicNotes className="text-[35px]" />}
              {!isCollapsed && <p>Music</p>}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-8 mb-5">
        {sessionUser && (
          <div className="flex gap-x-2 justify-center items-center  hover:cursor-pointer">
            {isLoaded && <AiOutlineSetting className="text-[35px]" />}
            {!isCollapsed && <p>Settings</p>}
          </div>
        )}
        {sessionUser ? (
          <div
            className="flex gap-x-2 justify-center items-center hover:cursor-pointer"
            onClick={() => {
              logoutClickHandler();
              collapseClickHandler();
            }}
          >
            <MdOutlineLogout className="text-[35px]" />
            {!isCollapsed && <p>Logout</p>}
          </div>
        ) : (
          <NavLink
            to="login"
            className="flex gap-x-2 justify-center items-center"
          >
            <MdOutlineLogin className="text-[35px]" />
            {!isCollapsed && <p>Login</p>}
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Navigation;
