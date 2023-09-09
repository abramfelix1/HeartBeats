import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotifySearch } from "../../store/spotify";

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
      }, 300);
      setTimer(newTimer);
    },
    [dispatch, timer]
  );

  const inputHandler = (e) => {
    setQuery(e.target.value);
    if (e.target.value !== "") {
      search(e.target.value);
    } else {
    }
  };

  return (
    <div className="bg-bkg-comp2 flex-col justify-center rounded-r-3xl w-96 z-[3] my-20 shadow-xl">
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
        <div className="playlist flex justify-center flex-wrap h-full w-full overflow-y-scroll">
          {artists &&
            artists.items.map((artist, index) => (
              <>
                {index === 0 ? (
                  <div
                    key={artist.id}
                    className="flex flex-row items-center w-full mx-4 bg-bkg-card hover:cursor-pointer hover:scale-105"
                  >
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-36 h-36"
                    />
                    <div className="flex flex-col h-full p-4">
                      <p className="flex text-txt-1 ">Top Result</p>
                      <p className="flex h-full text-txt-1 text-2xl font-bold items-center">
                        {artist.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={artist.id}
                    className="flex flex-col items-center max-w-[8rem] min-w-[8rem] hover:cursor-pointer hover:scale-105 m-4"
                  >
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-32 h-32"
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
          {tracks &&
            tracks.items.map((track) => (
              <div
                key={track.id}
                className="flex flex-row gap-x-2 p-2 items-center w-full hover:bg-bkg-card hover:cursor-pointer hover:scale-105 max-w-[19rem] min-w-[19rem]"
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
                  <p className="text-txt-1 w-full truncate">
                    {track.artists[0].name}
                  </p>
                </div>
                <div>
                  <p>PLAY</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
