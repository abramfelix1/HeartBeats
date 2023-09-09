import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSearch,
  resetSearchAction,
  spotifySearch,
} from "../../store/spotify";

export default function SearchSpotify() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const artists = useSelector((state) =>
    state.spotify.search ? state.spotify.search.artists : null
  );
  const tracks = useSelector((state) =>
    state.spotify.search ? state.spotify.search.tracks : null
  );
  const [showSongs, setShowSongs] = useState(true);
  const [showArtists, setShowArtists] = useState(false);
  const [timer, setTimer] = useState(null);

  const search = useCallback(
    (query) => {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        console.log("DISPATCH VALUE: ", query);
        dispatch(spotifySearch(query));
        setTimer(null);
      }, 500);
      setTimer(newTimer);
    },
    [dispatch, timer]
  );

  const inputHandler = (e) => {
    setQuery(e.target.value);
    console.log("SEARCH INPUT: ", e.target.value);
    if (e.target.value) {
      search(e.target.value);
    } else {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      dispatch(resetSearchAction());
    }
  };

  return (
    <div className="bg-bkg-card flex-col justify-center rounded-r-3xl w-[26rem] z-[3] my-20 shadow-xl">
      <div className="flex gap-x-2 p-4 items-center">
        <input
          type="text"
          value={query}
          onChange={inputHandler}
          placeholder="Search Artists or Songs"
          className="text-txt-2"
        />
        <div>
          <p>Select Genres</p>
        </div>
      </div>
      <div className="flex h-full w-full pb-24">
        <div className="playlist flex flex-col w-full overflow-y-scroll">
          {artists && (
            <div className="flex flex-col">
              <div
                key={artists.items[0].id}
                className="flex flex-row mx-4 ml-0 bg-bkg-nav hover:cursor-pointer hover:scale-105 rounded-r-3xl"
              >
                <img
                  src={artists.items[0].images[0]?.url}
                  alt={artists.items[0].name}
                  className="w-36 h-36"
                />
                <div className="flex flex-col py-2 px-4 w-full">
                  <div className="flex justify-between items-center">
                    <p className="flex text-txt-1 font-semibold">Top Result</p>
                    <p className="flex text-txt-1 font-semibold w-fit p-[3px] rounded-xl bg-bkg-button">
                      Artist
                    </p>
                  </div>
                  <div className="flex h-full w-full items-center max-w-[15rem] min-w-[15rem]">
                    <p className="text-txt-1 text-xl font-bold">
                      {artists.items[0].name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row overflow-x-scroll">
                {artists.items.map((artist, index) => (
                  <>
                    {index > 1 && (
                      <div
                        key={artist.id}
                        className="flex flex-col items-center max-w-[8rem] min-w-[8rem] hover:cursor-pointer hover:scale-105 m-4 rounded-b-3xl"
                      >
                        <img
                          src={artist.images[0]?.url}
                          alt={artist.name}
                          className="w-24 h-24"
                        />
                        <p
                          className={`truncate text-txt-1 text-lg text-semibold ${
                            artist.name.length > 17 && "w-full"
                          }`}
                        >
                          {artist.name}
                        </p>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
          {tracks && (
            <div className="flex flex-col">
              <div
                key={tracks.items[0].id}
                className="flex flex-row mx-4 ml-0 bg-bkg-nav hover:cursor-pointer hover:scale-105 rounded-r-3xl"
              >
                <img
                  src={tracks.items[0].album.images[0]?.url}
                  alt={tracks.items[0].name}
                  className="w-36 h-36"
                />
                <div className="flex flex-col py-2 px-4 w-full">
                  <div className="flex justify-between items-center">
                    <p className="flex text-txt-1 font-semibold">Top Result</p>
                    <p className="flex text-txt-1 font-semibold w-fit p-[3px] rounded-xl bg-bkg-button">
                      Song
                    </p>
                  </div>
                  <div className="flex flex-col h-full w-full justify-center max-w [15rem] min-w-[15rem]">
                    <p className="text-txt-1 text-xl font-bold items-center truncate">
                      {tracks.items[0].name}
                    </p>
                    <p className="text-lg text-txt-1 font-semibold items-center truncate">
                      {tracks.items[0].artists[0].name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row ">
                {tracks.items.map((track, index) => (
                  <>
                    {index > 1 && (
                      <div
                        key={track.id}
                        className="flex flex-row gap-x-2 m-4 items-center w-full hover:cursor-pointer hover:scale-105 max-w-[16rem] min-w-[16rem] bg-bkg-nav"
                      >
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.name}
                          width="50"
                          className="w-24 h-24"
                        />
                        <div className="w-full truncate">
                          <p className="text-txt-1 font-semibold w-full truncate">
                            {track.name}
                          </p>
                          <p className="text-txt-1 text-lg w-full truncate">
                            {track.artists[0].name}
                          </p>
                        </div>
                        <div>
                          <p>PLAY</p>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
