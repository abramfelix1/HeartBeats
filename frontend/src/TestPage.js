import React, { useEffect } from "react";
import SpotifyLogin from "./components/Login/SpotifyLogin";
import { useDispatch } from "react-redux";
import { getSpotifyUser, getTestSong } from "./store/spotify";
import { checkLoggedIn } from "./store/session";

export default function TestPage() {
  const dispatch = useDispatch();
  const userDataHandler = () => {
    dispatch(getSpotifyUser());
  };
  const testSongHandler = () => {
    dispatch(getTestSong());
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
      <button
        onClick={(e) => {
          testSongHandler();
        }}
      >
        Get Test Song
      </button>
      <SpotifyLogin />
    </div>
  );
}
