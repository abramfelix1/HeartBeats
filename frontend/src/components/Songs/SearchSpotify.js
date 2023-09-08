import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotifySearch } from "../../store/spotify";

export default function SearchSpotify() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  //   const results = useSelector((state) => state.spotify?.search);

  const inputHandler = (e) => {
    setQuery(e.target.value);
    dispatch(spotifySearch(e.target.value));
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={inputHandler}
        placeholder="Search Spotify"
      />
    </div>
  );
}
