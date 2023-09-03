import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStopCircle, BsPlayCircle, BsQuestionCircle } from "react-icons/bs";
import { Howl } from "howler";
import spotifyLogo from "../../images/Spotify_Logo_RGB_Green.png";
import spotifyIcon from "../../images/Spotify_Icon_RGB_Green.png";
import "./songs.css";

export default function SongRecs() {
  const dispatch = useDispatch();
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : [];
  });
  const scrollContainerRef = useRef(null);

  const [remainingTime, setRemainingTime] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const intervalRef = useRef(null);
  const soundRef = useRef(null);

  const updateRemainingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    setRemainingTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  };

  const clearCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = (sound) => {
    clearCountdown();

    intervalRef.current = setInterval(() => {
      const elapsed = sound.seek() || 0;
      const remaining = sound.duration() - elapsed;
      updateRemainingTime(remaining);

      if (remaining <= 0) {
        clearCountdown();
        setUrl(null);
      }
    }, 1000);
  };

  const playSound = (songUrl, idx) => {
    setUrl(songUrl);
    setCurrentPlaying(idx);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    setIsPlaying(false);
    setCurrentPlaying(null);
    setRemainingTime("");
    setUrl(null);
  };

  useEffect(() => {
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
          startCountdown(sound);
        },
        onend: function () {
          setIsPlaying(false);
          setCurrentPlaying(null);
        },
      });
      soundRef.current = sound;
      sound.play();

      return () => {
        sound.unload();
        clearCountdown();
      };
    }
  }, [url]);

  return (
    <div className="flex flex-col flex-grow w-full max-h-[50%] mb-2 bg-baby-powder rounded-3xl relative ">
      {/* <div className="p-4">
        <img src={spotifyLogo} alt="spotify logo" className="w-40" />
      </div> */}
      <div className="flex flex-row pt-3 px-3 justify-between items-center">
        <button className="w-fit h-fit p-1 font-medium hover:scale-x-105">
          Generate Songs
        </button>
        <BsQuestionCircle className="text-xl" />
      </div>
      <div
        ref={scrollContainerRef}
        className="songs-list mx-3 h-full overflow-x-auto"
      >
        <div className="flex flex-row gap-x-5 w-max h-1">
          {songs &&
            songs.map((song, idx) => (
              <div className="flex flex-col pt-4 items-center ">
                <img
                  src={song.album.images[1].url}
                  alt="album cover"
                  className="song-img h-56"
                />
                <a
                  href={song.external_urls.spotify}
                  className="flex flex-row gap-x-2 border-[1px] p-1 rounded-3xl mt-2 justify-center hover:bg-slate-100 font-semibold w-full"
                >
                  <img src={spotifyIcon} alt="spotify icon" className="w-7" />{" "}
                  <p>Open Spotify</p>
                </a>
                <div className="flex flex-col gap-y-1 py-2 font-semibold justify-center items-center">
                  <p className="text-lg">{song.name}</p>
                  <p>
                    <span className="font-normal">by </span>
                    {song.artists[0].name}
                    {song.artists.length > 1 && " ft. "}
                    {song.artists.slice(1).map((artist, idx, array) => (
                      <span key={idx}>
                        {artist.name}
                        {array.length > 1 && idx !== array.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </p>
                  <p>{song.album.name}</p>
                  <div className="flex flex-row gap-x-2">
                    {song.preview_url ? (
                      <>
                        <button
                          onClick={() => {
                            if (isPlaying && currentPlaying === idx) {
                              stopSound();
                            } else {
                              playSound(song.preview_url, idx);
                            }
                          }}
                        >
                          <div>
                            {isPlaying && currentPlaying === idx ? (
                              <BsStopCircle className="text-xl" /> // stop icon
                            ) : (
                              <BsPlayCircle className="text-xl" />
                            )}
                          </div>
                        </button>
                        {isPlaying && currentPlaying === idx && (
                          <p>{remainingTime}</p>
                        )}
                      </>
                    ) : (
                      "No Preview"
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
