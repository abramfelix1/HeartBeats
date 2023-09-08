import React, { useState } from "react";
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

  const inputHandler = (e) => {
    setQuery(e.target.value);
    dispatch(spotifySearch(e.target.value));
  };

  return (
    <div className="bg-bkg-comp2 flex-col justify-center rounded-r-3xl w-96 z-[3] my-20 shadow-xl">
      <div className="p-4">
        <input
          type="text"
          value={query}
          onChange={inputHandler}
          placeholder="Search Spotify"
        />
      </div>
      <div className="flex flex-row  h-full w-full pb-24">
        <div className="playlist flex flex-row  justify-center flex-wrap gap-4 h-full w-full overflow-y-scroll">
          {artists &&
            artists.items.map((artist) => (
              <div key={artist.id} className="flex flex-col">
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  width="50"
                  className="w-40 h-40"
                />
                <p>{artist.name}</p>
              </div>
            ))}

          {/* {tracks &&
            tracks.items.map((track) => (
              <div key={track.id} className="flex flex-row gap-x-2 py-2">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  width="50"
                  className="w-40 h-40"
                />
                <p>
                  {track.name} by {track.artists[0].name}
                </p>
              </div>
            ))} */}
        </div>
      </div>
    </div>
  );
}
