import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { logout } from "../../store/session";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { PiMusicNotes, PiUser } from "react-icons/pi";

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const logoutClickHandler = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col mx-5 my-5 items-center">
      <div className="flex-grow flex flex-col justify-start items-center">
        <NavLink exact to="/" className="inline-block">
          <img src={logo} alt="logo" className="w-[100px]" />
        </NavLink>
        <div className="sm:my-0 md:my-5 lg:my-20 opacity-100 text-yale-blue">
          <div className="space-y-5">
            {sessionUser && (
              <div className="flex flex-col items-center my-5 hover:cursor-pointer">
                <AiOutlineUser className="text-[35px]" />
                <p>Profile</p>
              </div>
            )}
            {sessionUser && (
              <div className="flex flex-col items-center hover:cursor-pointer">
                {isLoaded && <AiOutlineEdit className="text-[35px]" />}
                <p>Journal</p>
              </div>
            )}
            {sessionUser && (
              <div className="flex flex-col items-center hover:cursor-pointer">
                {isLoaded && <PiMusicNotes className="text-[35px]" />}
                <p>Music</p>
              </div>
            )}
            {sessionUser && (
              <div className="flex flex-col items-center hover:cursor-pointer">
                {isLoaded && <AiOutlineSetting className="text-[35px]" />}
                <p>Settings</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sm:my-0 md:my-5 lg:my-20 opacity-100 text-yale-blue">
        {sessionUser ? (
          <div
            className="flex flex-col items-center hover:cursor-pointer"
            onClick={logoutClickHandler}
          >
            <MdOutlineLogout className="text-[35px]" />
            <p>Logout</p>
          </div>
        ) : (
          <NavLink to="login" className="flex flex-col items-center">
            <MdOutlineLogin className="text-[35px]" />
            <p>Login</p>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Navigation;
