import React, { useEffect, useRef, useState } from "react";
import SpotifyLogin from "./components/LoginFormPage/SpotifyLogin";
import { useDispatch } from "react-redux";
import { getSpotifyUser, getTestSong, getRecSongs } from "./store/spotify";
import {
  getAllJournals,
  createJournal,
  updateJournal,
  deleteJournal,
} from "./store/journals";
import { checkLoggedIn } from "./store/session";
import { useSelector } from "react-redux";
import { Howl } from "howler";

export default function TestPage() {
  const dispatch = useDispatch();
  const song = useSelector((state) => state.spotify.song?.tracks[0]);
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : [];
  });
  const journals = useSelector((state) => Object.values(state.journals));

  //Use these for getRecSongs thunk
  //Split genres with a %2C if sending in an array of generes
  const [genre, setGenre] = useState("");
  const [maxInstrumentalness, setMaxInstrumentalness] = useState(1);
  const [minInstrumentalness, setMinInstrumentalness] = useState(0);
  const [maxValence, setMaxValence] = useState(1);
  const [minValence, setMinValence] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(1);
  const [minEnergy, setMinEnergy] = useState(0);

  //AUDIO PLAYER: Convert to context later, add volume, play/pause, duration slider, maybe a forward and back, and add all the url's generated to the src arr inside of howl(Look up if possible)
  const [remainingTime, setRemainingTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const soundRef = useRef(null);

  const updateRemainingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    setRemainingTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  };

  const startCountdown = (sound) => {
    const interval = setInterval(() => {
      if (isPlaying && sound) {
        const elapsed = sound.seek() || 0;
        const remaining = sound.duration() - elapsed;
        updateRemainingTime(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setUrl(null);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return interval;
  };

  useEffect(() => {
    console.log(url);
    if (url) {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      const sound = new Howl({
        src: [url],
        html5: true,
        volume: 0.25,
        onload: function () {
          updateRemainingTime(sound.duration());
        },
        onplay: function () {
          setIsPlaying(true);
          startCountdown(sound);
        },
        onend: function () {
          setIsPlaying(false);
        },
      });
      soundRef.current = sound;
      sound.play();

      return () => {
        sound.unload();
      };
    }
  }, [url]);

  const playSound = (songUrl) => {
    setUrl(songUrl);
  };

  //TEST BUTTONS
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

  //JOURNAL HANDLERS
  const getAllJournalsHandler = () => {
    console.log("CLICK GET ALL JOURNALS");
    dispatch(getAllJournals());
  };

  const createJournalHandler = () => {
    console.log("CLICK CREATE JOURNAL");
    dispatch(createJournal());
  };

  const updateJournalHandler = () => {
    console.log("CLICK UPDATE JOURNAL");
    const id = 1;
    const payload = { name: "UPDATED NAME", content: "UPDATED CONTENT" };
    dispatch(updateJournal(id, payload));
  };

  const deleteJournalHandler = () => {
    console.log("CLICK DELETE JOURNAL");
    const id = 2;
    dispatch(deleteJournal(id));
  };

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

      {/* SLIDERS SECTION */}
      <div>
        <p>GENERATE SONGS</p>
        <p>
          VALENCE: {minValence} - {maxValence}
        </p>
        <p>
          ENERGY: {minEnergy} - {maxEnergy}
        </p>
        <p>
          Instrumentalness: {minInstrumentalness} - {maxInstrumentalness}
        </p>
        <p>GENRE: {genre}</p>
        <button
          onClick={() =>
            recSongsHandler({
              minValence,
              maxValence,
              minEnergy,
              maxEnergy,
              minInstrumentalness,
              maxInstrumentalness,
              genre,
            })
          }
        >
          <p className="font-extrabold">GENERATE SONGS</p>
        </button>
        <div>
          Genre
          <input type="text" onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          Min Instrumentalness
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => setMinInstrumentalness(e.target.value)}
          />
        </div>
        <div>
          Max Instrumentalness
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => setMaxInstrumentalness(e.target.value)}
          />
        </div>
        <div>
          Min Valence
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            onChange={(e) => setMinValence(e.target.value)}
          />
        </div>
        <div>
          Max Valence
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            onChange={(e) => setMaxValence(e.target.value)}
          />
        </div>
        <div>
          Min Energy
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            onChange={(e) => setMinEnergy(e.target.value)}
          />
        </div>
        <div>
          Max Energy
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            onChange={(e) => setMaxEnergy(e.target.value)}
          />
        </div>
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
                {song.preview_url ? (
                  <>
                    <button onClick={() => playSound(song.preview_url)}>
                      Play
                    </button>
                    <p>Remaining Time: {remainingTime}</p>
                  </>
                ) : (
                  "No Preview"
                )}
              </p>
              <img src={song.album.images[1].url} alt="album cover" />
            </div>
          ))}
      </div>

      {/* JOURNALS SECTION */}
      <div class="flex flex-col items-start">
        <p className="font-extrabold">JOURNALS</p>
        <button className="font-semibold" onClick={getAllJournalsHandler}>
          GET ALL JOURNALS
        </button>
        <button className="font-semibold" onClick={createJournalHandler}>
          CREATE
        </button>
        <button className="font-semibold" onClick={updateJournalHandler}>
          UPDATE
        </button>
        <button className="font-semibold" onClick={deleteJournalHandler}>
          DELETE
        </button>
        {/* creating generates blank page, but sets title to date */}
        {/* have it save every 15 sec when on it (update)*/}
        {/* if there is no content, dont save */}
        {/* <>
          <input type="text" />]
        </> */}
      </div>
    </div>
  );
}
