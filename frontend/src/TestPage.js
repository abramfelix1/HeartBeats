import React, { useEffect } from "react";
import SpotifyLogin from "./components/Login/SpotifyLogin";
import { useDispatch } from "react-redux";
import { getSpotifyUser, getTestSong } from "./store/spotify";
import { checkLoggedIn } from "./store/session";
import { useSelector } from "react-redux";

export default function TestPage() {
  const dispatch = useDispatch();
  const song = useSelector((state) => state.spotify.song?.tracks[0]);
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
      <div>
        <button
          onClick={(e) => {
            testSongHandler();
          }}
        >
          Get Test Song
        </button>
      </div>
      <SpotifyLogin />
      {song && (
        <div>
          <p>Song Name: {song.name}</p>
          <a href={song.external_urls.spotify}>Open on Spotify</a>
          <p>
            Artist: {song.artists[0].name} ft.{" "}
            {song.artists.map((artist, idx) => (
              <span>{idx > 0 && artist.name}</span>
            ))}
          </p>
          <p>
            Preview:
            {song.preview_url &&
              "https://p.scdn.co/mp3-preview/3712f36beb77371010c96cdaffbf1ac9025ec0fe?cid=2c24c289ce0448af9c1a7a9f98f78d31"}
          </p>
          <img src={song.album.images[1].url} alt="album cover" />
        </div>
      )}
    </div>
  );
}
