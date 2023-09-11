import React from "react";
import logo from "../../images/heartBeatLogoName.png";
import songs from "../../images/landing2.png";
import editor from "../../images/landingPageEditor.png";

export default function LandingPage() {
  return (
    <div className="font-poppins flex w-screen h-screen bg-white">
      <div className="flex flex-col w-full">
        <div className="flex items-start w-full  p-4">
          <img className="w-96" src={logo} alt="logo" />
        </div>
        <div className="flex w-full h-full justify-around items-center relative ">
          <div>
            <p className="">"a"</p>
          </div>
          <div>
            <img className=" w-[720px] drop-shadow-xl" src={songs} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
