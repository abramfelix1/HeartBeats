import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Howl } from "howler";

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
    <div className="flex flex-col h-[50%] bg-baby-powder rounded-3xl overflow-y-auto">
      <div className="p-5">
        {songs &&
          songs.map((song, idx) => (
            <div className="flex flex-row">
              <img src={song.album.images[1].url} alt="album cover" />
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
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
