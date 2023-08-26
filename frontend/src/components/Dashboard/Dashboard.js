import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { getSpotifyUser } from "../../store/spotify";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(getSpotifyUser());
    dispatch(sessionActions.checkLoggedIn());
  }, [dispatch]);

  return (
    <div className="bg-[#FCF7F8] w-screen h-screen flex bg-gradient-to-r from-white  via-sky-400 via-30% to-azure-blue overflow-hidden">
      <Navigation isLoaded={isLoaded} />
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-white">Welcome</p>
      </div>
    </div>
  );
}
