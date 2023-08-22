import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../images/heartBeatLogo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div class="flex flex-col absolute mx-5 my-5">
      <NavLink exact to="/" class="inline-block">
        <img src={logo} alt="logo" class="w-[100px]" />
      </NavLink>
      {isLoaded && <ProfileButton user={sessionUser} />}
    </div>
  );
}

export default Navigation;
