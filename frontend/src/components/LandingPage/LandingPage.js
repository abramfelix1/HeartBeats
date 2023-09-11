import React from "react";
import logo from "../../images/heartBeatLogo.png";

export default function LandingPage() {
  return (
    <div className="flex w-screen h-screen bg-blue-100">
      <div className="flex w-full">
        <div className="flex h-24 w-full items-center bg-blue-200">
          <img className="w-24 h-24 p-4" src={logo} alt="logo" />
          <p className="text-5xl p-2">HeartBeats</p>
        </div>
      </div>
    </div>
  );
}
