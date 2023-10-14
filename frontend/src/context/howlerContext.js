import React, { createContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export const HowlerContext = createContext();

export const HowlerProvider = ({ children }) => {
  const playerRef = useRef(null);
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

  const playSound = (songUrl, id) => {
    setUrl(songUrl);
    setCurrentPlaying(id);
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
    console.log("STOP SOUND");
  };

  useEffect(() => {
    if (url) {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      const sound = new Howl({
        src: [url],
        html5: true,
        volume: 0.15,
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
    <HowlerContext.Provider
      value={{
        stopSound,
        playSound,
        remainingTime,
        currentPlaying,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </HowlerContext.Provider>
  );
};
