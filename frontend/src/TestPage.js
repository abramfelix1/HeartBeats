import React, { useEffect, useState } from "react";
import SpotifyLogin from "./components/Login/SpotifyLogin";
import { useDispatch } from "react-redux";
import { getSpotifyUser, getTestSong, getRecSongs } from "./store/spotify";
import { checkLoggedIn } from "./store/session";
import { useSelector } from "react-redux";
import Howl from "howler";

export default function TestPage() {
  const playSong = (url) => {
    const sound = new Howl({
      src: [url],
    });

    sound.play();
  };

  const [maxValence, setMaxValence] = useState(0);
  const [minValence, setMinValence] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(0);
  const [minEnergy, setMinEnergy] = useState(0);
  const dispatch = useDispatch();
  const song = useSelector((state) => state.spotify.song?.tracks[0]);
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : [];
  });
  const userDataHandler = () => {
    dispatch(getSpotifyUser());
  };
  const testSongHandler = () => {
    dispatch(getTestSong());
  };

  const recSongsHandler = (payload) => {
    console.log("REC SONGS HANDLER");
    dispatch(getRecSongs(payload));
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
      <div>
        <p>GENERATE SONGS</p>
        <p>
          VALENCE: {minValence} - {maxValence}
        </p>
        <p>
          ENERGY: {minEnergy} - {maxEnergy}
        </p>
        <button
          onClick={() =>
            recSongsHandler({ minValence, maxValence, minEnergy, maxEnergy })
          }
        >
          GET SONGS
        </button>
        Min Valence
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          onChange={(e) => setMinValence(e.target.value)}
        />
        Max Valence
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          onChange={(e) => setMaxValence(e.target.value)}
        />
        Min Energy
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          onChange={(e) => setMinEnergy(e.target.value)}
        />
        Max Energy
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          onChange={(e) => setMaxEnergy(e.target.value)}
        />
      </div>
      <div>
        {songs &&
          songs.map((song, idx) => (
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
                <button onClick={() => playSong(song.preview_url)}>Play</button>
              </p>
              <img src={song.album.images[1].url} alt="album cover" />
            </div>
          ))}
      </div>
    </div>
  );
}
