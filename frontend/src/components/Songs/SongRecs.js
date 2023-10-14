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
import { HowlerContext } from "../../context/howlerContext";
import "swiper/css";
import { ModalContext } from "../../context/ModalContext";
import { ThemeContext } from "../../context/themeContext";
import loading from "../../images/icons/musicLoad.svg";
import loading2 from "../../images/icons/musicLoad2.svg";
import { WebPlayerContext } from "../../context/webPlayerContext";
import { Tooltip } from "react-tooltip";

export default function SongRecs() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
  const {
    stopSound,
    playSound,
    remainingTime,
    currentPlaying,
    isPlaying,
    setIsPlaying,
  } = useContext(HowlerContext);
  const {
    setCurrentSongId,
    currentSongId,
    playSong,
    pauseSong,
    handlePlaylist,
    setPlaylistUris,
    setResetPlaylist,
  } = useContext(WebPlayerContext);
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : null;
  });
  const scrollContainerRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const sessionSpotify = useSelector((state) =>
    state.session.user.spotifyId ? state.session.user.spotifyId : null
  );
  const playlist = useSelector((state) => state.playlists?.[playlistId]);

  const addSongHandler = async (payload) => {
    if (playlistId) {
      const songId = await dispatch(createSong(payload));
      // console.log(songId);
      if (songId) {
        await dispatch(addSongToPlaylist(playlistId, songId));
      }
    }
  };

  return songs ? (
    <div className="flex rounded-3xl relative cursor-default">
      <div
        ref={scrollContainerRef}
        className="flex flex-col songs-list mx-4 w-full relative"
      >
        <div className="flex flex-row gap-x-8 w-max">
          {songs &&
            songs.map((song, idx) => (
              <div
                key={idx}
                className="bg-bkg-body song-item flex flex-col max-w-[256px] shadow-md hover:scale-105"
              >
                <img
                  src={song.album.images[1].url}
                  alt="album cover"
                  className="h-64 w-64 select-none"
                />
                <div className="flex w-full flex-row-reverse justify-between items-center mt-2 px-4">
                  <a
                    href={song.external_urls.spotify}
                    className="flex flex-row w-fit gap-x-2 p-1 rounded-3xl  select-none items items-center"
                  >
                    <img
                      src={spotifyIcon}
                      alt="spotify icon"
                      className="w-7 hover:scale-105"
                    />{" "}
                  </a>
                  <div className="flex flex-row gap-x-4 items-center">
                    {!sessionSpotify && (
                      <>
                        {song.preview_url ? (
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                if (isPlaying && currentPlaying === song.id) {
                                  stopSound();
                                } else {
                                  playSound(song.preview_url, song.id);
                                }
                              }}
                            >
                              <div className="flex items-center">
                                {isPlaying && currentPlaying === song.id ? (
                                  <BsStopCircle className="text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                                ) : (
                                  <BsPlayCircle className=" text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                                )}
                              </div>
                            </button>
                            {isPlaying && currentPlaying === song.id && (
                              <p className="pl-2">{remainingTime}</p>
                            )}
                          </div>
                        ) : (
                          <BsPlayCircle
                            className={`text-gray-300 text-2xl
                        ${theme === "dark" && "text-slate-800"}
                        `}
                            data-tooltip-id="song-recs"
                            data-tooltip-content={`"${song.name}" Preview Unavailable`}
                          />
                        )}
                      </>
                    )}

                    {sessionSpotify && (
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            if (isPlaying && currentSongId === song.id) {
                              pauseSong();
                            } else {
                              // playSong(song.id);
                              handlePlaylist(song.id, [
                                `spotify:track:${song.id}`,
                              ]);
                              setIsPlaying(true);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            {isPlaying && currentSongId === song.id ? (
                              <BsStopCircle className="text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                            ) : (
                              <BsPlayCircle className=" text-bkg-text text-2xl hover:text-txt-hover hover:scale-105" />
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                    {playlistId ? (
                      <IoAddCircleOutline
                        className="text-bkg-text text-3xl hover:text-txt-hover hover:scale-105 hover:cursor-pointer"
                        data-tooltip-id="song-recs"
                        data-tooltip-content={`Add to: "${playlist.name}"`}
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
                    ) : (
                      <IoAddCircleOutline
                        className={`text-gray-300 text-3xl
                      ${theme === "dark" && "text-slate-800"}
                      `}
                        data-tooltip-id="song-recs"
                        data-tooltip-content={`Open A Playlist To Add "${song.name}"`}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 py-2 font-medium px-4">
                  <p className="text-xl truncate ">{song.name}</p>
                  <p className="text-bkg-text truncate text-lg">
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
                  <p className="text-bkg-text truncate text-lg">
                    {song.album.name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Tooltip
        className="z-10"
        place="bottom"
        type="dark"
        effect="solid"
        id="song-recs"
      />
    </div>
  ) : (
    <div className="flex justify-center ">
      {theme === "dark" ? (
        <img className="border-b-2 w-fit" src={loading2} alt="Loading..." />
      ) : (
        <img className="border-b-2 w-fit" src={loading} alt="Loading..." />
      )}
    </div>
  );
}
