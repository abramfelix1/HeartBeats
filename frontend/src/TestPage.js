import React, { useEffect } from "react";
import SpotifyLogin from "./components/Login/SpotifyLogin";
import { useDispatch } from "react-redux";
import { getSpotifyUser } from "./store/spotify";
import { checkLoggedIn } from "./store/session";

export default function TestPage() {
  const dispatch = useDispatch();
  const userDataHandler = () => {
    dispatch(getSpotifyUser());
  };

  useEffect(() => {
    dispatch(checkLoggedIn());
  }, [dispatch]);

  return (
    <div>
      <button
        onClick={(e) => {
          userDataHandler();
        }}
      >
        Get User Data
      </button>
      <SpotifyLogin />
    </div>
  );
}
