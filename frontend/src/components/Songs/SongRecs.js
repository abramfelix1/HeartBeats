import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlinePlayCircle,
  AiFillRightCircle,
  AiFillLeftCircle,
} from "react-icons/ai";
import { Howl } from "howler";
import spotifyLogo from "../../images/Spotify_Logo_RGB_Green.png";
import spotifyIcon from "../../images/Spotify_Icon_RGB_Green.png";

export default function SongRecs() {
  const dispatch = useDispatch();
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : [];
  });
  const scrollContainerRef = useRef(null);

  const scrollAmount = 200;

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    container.scroll({
      left: container.scrollLeft - scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    container.scroll({
      left: container.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

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

  return (
    <div className="flex flex-col w-full bg-baby-powder rounded-3xl relative">
      {/* <div className="p-4">
        <img src={spotifyLogo} alt="spotify logo" className="w-40" />
      </div> */}

      {/* <button
        onClick={scrollLeft}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 rounded-full p-1 text-3xl text-white"
      >
        <AiFillLeftCircle />
      </button>

      <button
        onClick={scrollRight}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10  text-white text-3xl"
      >
        <AiFillRightCircle />
      </button> */}

      <div ref={scrollContainerRef} className="overflow-x-auto">
        <div className="flex flex-row flex-nowrap w-max">
          {songs &&
            songs.map((song, idx) => (
              <div className="flex flex-col p-5 items-center">
                <img
                  src={song.album.images[1].url}
                  alt="album cover"
                  className="w-80 h-80"
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
                  <div className="flex flex-row">
                    {song.preview_url ? (
                      <>
                        <button onClick={() => playSound(song.preview_url)}>
                          <div>
                            <AiOutlinePlayCircle className="text-xl" />
                          </div>
                        </button>
                        <p>{remainingTime}</p>
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
