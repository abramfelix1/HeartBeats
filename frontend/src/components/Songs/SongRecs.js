import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { Howl } from "howler";
import spotifyLogo from "../../images/Spotify_Logo_RGB_Green.png";
import spotifyIcon from "../../images/Spotify_Icon_RGB_Green.png";

export default function SongRecs() {
  const dispatch = useDispatch();
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : [];
  });

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
    <div className="flex flex-col w-full bg-baby-powder rounded-3xl overflow-x-auto">
      {/* <div className="p-4">
        <img src={spotifyLogo} alt="spotify logo" className="w-40" />
      </div> */}
      <div className="flex flex-row flex-nowrap w-max justify-between px-4">
        {songs &&
          songs.map((song, idx) => (
            <div className="flex flex-col p-4">
              <img
                src={song.album.images[1].url}
                alt="album cover"
                className="w-80 h-80"
              />
              <div className="flex flex-col gap-y-1 py-2 font-semibold">
                <a
                  href={song.external_urls.spotify}
                  className="flex flex-row gap-x-2 border-[1px] p-1 rounded-3xl justify-center hover:bg-slate-100 font-semibold"
                >
                  <img src={spotifyIcon} alt="spotify icon" className="w-7" />{" "}
                  <p>Open Spotify</p>
                </a>
                <p className="text-lg">{song.name}</p>
                <p>
                  <span className="font-normal">by </span>
                  {song.artists[0].name}
                  {song.artists.length > 1 && " ft. "}
                  {song.artists.slice(1).map((artist, idx, array) => (
                    <span key={idx}>
                      {artist.name}
                      {array.length > 1 && idx !== array.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p>{song.album.name}</p>
                {/* <p>
                  {song.preview_url ? (
                    <>
                      <button onClick={() => playSound(song.preview_url)}>
                        <div>
                          <AiOutlinePlayCircle className="text-lg" />
                        </div>
                      </button>
                      <p>Remaining Time: {remainingTime}</p>
                    </>
                  ) : (
                    "No Preview"
                  )}
                </p> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
