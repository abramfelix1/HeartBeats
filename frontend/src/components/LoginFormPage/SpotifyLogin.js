import React from "react";
import { useDispatch } from "react-redux";
import { spotifyLogin } from "../../store/session";

export default function SpotifyLogin() {
  const dispatch = useDispatch();
  const buttonHandler = () => {
    // console.log("SPOTIFY BUTTON CLIcKED");
    dispatch(spotifyLogin());
  };
  return <button onClick={(e) => buttonHandler()}>SpotifyLoginTEST</button>;
}
