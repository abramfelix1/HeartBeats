import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout, MdOutlineLogin } from "react-icons/md";
import { PiMusicNotes, PiUser } from "react-icons/pi";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div class="flex flex-col mx-5 my-5 items-center">
      <NavLink exact to="/" class="inline-block">
        <img src={logo} alt="logo" class="w-[100px]" />
      </NavLink>
      <div class="sm:my-0 md:my-5 lg:my-20 opacity-100 text-yale-blue">
        <div class="flex flex-col items-center my-5 hover:cursor-pointer">
          {isLoaded && <AiOutlineUser class="text-[35px]" />}
          <p>Profile</p>
        </div>
        <div class="space-y-8">
          <div class="flex flex-col items-center hover:cursor-pointer">
            {isLoaded && <AiOutlineEdit class="text-[35px]" />}
            <p>Journal</p>
          </div>
          <div class="flex flex-col items-center hover:cursor-pointer">
            {isLoaded && <PiMusicNotes class="text-[35px]" />}
            <p>Music</p>
          </div>
          <div class="flex flex-col items-center hover:cursor-pointer">
            {isLoaded && <AiOutlineSetting class="text-[35px]" />}
            <p>Settings</p>
          </div>
          {isLoaded ? (
            <div class="flex flex-col items-center hover:cursor-pointer">
              <MdOutlineLogout class="text-[35px]" />
              <p>Logout</p>
            </div>
          ) : (
            <div class="flex flex-col items-center">
              <MdOutlineLogin class="text-[35px]" />
              <p>Login</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
