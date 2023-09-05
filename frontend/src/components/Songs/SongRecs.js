import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsStopCircle, BsPlayCircle, BsQuestionCircle } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { Howl } from "howler";
import spotifyLogo from "../../images/Spotify_Logo_RGB_Green.png";
import spotifyIcon from "../../images/Spotify_Icon_RGB_Green.png";
import "./songs.css";
import { PlaylistContext } from "../../context/playlistContext";
import { addSongToPlaylist, createSong } from "../../store/playlists";

export default function SongRecs() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : null;
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

  const addSongHandler = async (payload) => {
    if (playlistId) {
      const songId = await dispatch(createSong(payload));
      console.log(songId);
      if (songId) {
        await dispatch(addSongToPlaylist(playlistId, songId));
      }
    }
  };

  return (
    songs && (
      <div className="bg-bkg-card flex flex-col flex-grow w-full max-h-[50%] mb-2 rounded-3xl relative  cursor-default">
        {/* <div className="p-4">
        <img src={spotifyLogo} alt="spotify logo" className="w-40" />
      </div> */}
        <div className="flex flex-row pt-3 px-3 justify-between items-center">
          <button className="text-bkg-text hover:scale-x-105 hover:text-txt-hover w-fit h-fit p-1 font-semibold ">
            Generate Songs
          </button>
          <BsQuestionCircle className="text-bkg-text font-semibold text-2xl hover:scale-x-105 hover:text-txt-hover hover:cursor-pointer" />
        </div>
        <div
          ref={scrollContainerRef}
          className="songs-list mx-4 h-full overflow-x-auto"
        >
          <div className="flex flex-row gap-x-8 w-max h-1">
            {songs &&
              songs.map((song, idx) => (
                <div className="flex flex-col pt-4 max-w-[208px]">
                  <img
                    src={song.album.images[1].url}
                    alt="album cover"
                    className="h-52"
                  />
                  <a
                    href={song.external_urls.spotify}
                    className="flex flex-row gap-x-2 border-[1px] border-bkg-nav p-1 rounded-3xl mt-2 justify-center hover:border-txt-hover font-semibold w-full"
                  >
                    <img src={spotifyIcon} alt="spotify icon" className="w-7" />{" "}
                    <p>Open Spotify</p>
                  </a>
                  <div className="flex flex-col gap-y-1 py-2 font-semibold">
                    <p className="text-lg truncate">{song.name}</p>
                    <p className="text-bkg-text truncate">
                      <span></span>
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
                    <p className="text-bkg-text truncate">{song.album.name}</p>
                    <div className="flex flex-row gap-x-2 justify-between">
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
                                <BsStopCircle className="text-bkg-text text-xl hover:text-txt-hover" />
                              ) : (
                                <BsPlayCircle className=" text-bkg-text text-xl hover:text-txt-hover" />
                              )}
                            </div>
                          </button>
                          {isPlaying && currentPlaying === idx && (
                            <p>{remainingTime}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-bkg-text">No Preview</p>
                      )}
                      <IoAddCircleOutline
                        className="text-bkg-text text-2xl hover:text-txt-hover hover:scale-105 hover:cursor-pointer"
                        onClick={() => {
                          addSongHandler({
                            name: song.name,
                            artists: song.artists[0].name,
                            album: song.album.name,
                            img_url: song.album.images[1].url,
                            spotifyId: song.id,
                            spotify_url: song.external_urls.spotify,
                            preview: song?.preview_url || null,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  );
}
