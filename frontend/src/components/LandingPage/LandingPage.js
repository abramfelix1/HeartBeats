import React from "react";
import logo from "../../images/heartBeatLogoName.png";
import songs from "../../images/landing2.png";
import editor from "../../images/landingPageEditor.png";
import spotify from "../../images/Spotify_Logo_RGB_Green.png";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="font-poppins flex w-screen h-screen bg-white select-none">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center w-full p-10 ">
          <img className="w-72" src={logo} alt="logo" />
          <p className="text-2xl p-4 scale-y-150">|</p>
          <div className="flex items-center">
            <p className="text-lg font-medium">Powered By</p>
            <img className="w-36 px-2" src={spotify} alt="logo" />
          </div>
        </div>
        <div className="flex w-full h-full justify-around items-center relative px-16 bg-landing">
          <div className="flex flex-col gap-y-4 items-center">
            <p className="text-4xl font-semibold ">Music to Match Your Mood</p>
            <p className="text-3xl font-medium">
              Your journal is now your personal DJ.
            </p>
            <NavLink
              to="/login"
              className="w-fit border-2 border-black rounded-3xl p-2 bg-green-200 hover:bg-green-300"
            >
              Get Started
            </NavLink>
          </div>
          <div>
            <img className="w-[920px] drop-shadow-xl" src={songs} alt="logo" />
          </div>
        </div>
      </div>
      <div className="flex absolute bottom-0 gap-x-2 bg-slate-500 w-fit text-white p-2 justify-end select-none">
        <p>by Abram Felix</p>
        <a
          href={"https://www.linkedin.com/in/abram-felix/"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center hover:scale-110"
        >
          <BsLinkedin />
        </a>
        <a
          href={"https://github.com/abramfelix1"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center hover:scale-110"
        >
          <FaGithubSquare className="text-xl" />
        </a>
      </div>
    </div>
  );
}
