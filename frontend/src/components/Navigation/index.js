import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../images/heartBeatLogo.png";
import { AiOutlineUser, AiOutlineSetting, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { PiMusicNotes, PiUser } from "react-icons/pi";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div class="flex flex-col absolute mx-5 my-5 items-center">
      <NavLink exact to="/" class="inline-block">
        <img src={logo} alt="logo" class="w-[100px]" />
      </NavLink>
      <div>
        {isLoaded && <AiOutlineUser class="text-[35px]" />}
        {isLoaded && <AiOutlineEdit class="text-[35px]" />}
        {isLoaded && <PiMusicNotes class="text-[35px]" />}
        {isLoaded && <AiOutlineSetting class="text-[35px]" />}
        {isLoaded && <MdOutlineLogout class="text-[35px]" />}
      </div>
    </div>
  );
}

export default Navigation;
