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

export default function SongRecs() {
  const dispatch = useDispatch();
  const { playlistId } = useContext(PlaylistContext);
  const { stopSound, playSound, remainingTime, currentPlaying, isPlaying } =
    useContext(HowlerContext);
  const songs = useSelector((state) => {
    const tracks = state.spotify.songs?.tracks;
    return tracks ? Object.values(tracks) : null;
  });
  const scrollContainerRef = useRef(null);

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
      <div className="flex rounded-3xl relative cursor-default">
        <div
          ref={scrollContainerRef}
          className="flex flex-col songs-list mx-4 w-full relative"
        >
          <div className="flex flex-row gap-x-8 w-max ">
            {songs &&
              songs.map((song, idx) => (
                <div className="flex flex-col pt-4 max-w-[208px]">
                  <img
                    src={song.album.images[1].url}
                    alt="album cover"
                    className="h-52 select-none"
                  />
                  <a
                    href={song.external_urls.spotify}
                    className="flex flex-row gap-x-2 border-[1px] border-bkg-nav p-1 rounded-3xl mt-2 justify-center hover:border-txt-hover font-semibold w-full select-none"
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
                                <BsStopCircle className="text-bkg-text text-xl hover:text-txt-hover hover:scale-105" />
                              ) : (
                                <BsPlayCircle className=" text-bkg-text text-xl hover:text-txt-hover hover:scale-105" />
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
                      {playlistId && (
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
                      )}
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
