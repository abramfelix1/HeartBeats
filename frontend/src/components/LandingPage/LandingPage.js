import React from "react";
import logo from "../../images/heartBeatLogoName.png";

export default function LandingPage() {
  return (
    <div className="flex w-screen h-screen bg-white">
      <div className="flex w-full">
        <div className="flex items-start w-full  p-4">
          <img className="w-96 " src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
}
