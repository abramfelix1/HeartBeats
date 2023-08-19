import { csrfFetch } from "./csrf";
export const GET_SPOTIFY = "spotify/GET_SPOTIFY";
export const GET_SONG = "spotify/GET_SONG";
export const GET_REC_SONGS = "spotify/GET_REC_SONGS";

export const getSpotifyUserAction = (payload) => {
  return {
    type: GET_SPOTIFY,
    payload,
  };
};

export const getTestSongAction = (payload) => {
  return {
    type: GET_SONG,
    payload,
  };
};

export const getRecSongsAction = (payload) => {
  return {
    type: GET_REC_SONGS,
    payload,
  };
};

//store value as key in session reducer later
export const getSpotifyUser = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spotify/session", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      await dispatch(getSpotifyUserAction(data));
      console.log("SPOTIFY USER ACCOUNT", data);
    }
  } catch (err) {
    const data = await err.json();
    console.error("getSpotifyUser Error:", data.error);
  }
};

//store value as key in session reducer later
export const getTestSong = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spotify/songtest", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      await dispatch(getTestSongAction(data));
      console.log("TEST SONG", data);
    }
  } catch (err) {
    const data = await err.json();
    console.error("getTestSong ERROR:", data.error);
  }
};

export const getRecSongs = (payload) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spotify/recsongs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      await dispatch(getRecSongsAction(data));
      console.log("TEST SONG", data);
    }
  } catch (err) {
    const data = await err.json();
    console.error("getTestSong ERROR:", data.error);
  }
};

const initialState = {
  song: null,
  songs: null,
};

export const spotifyReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_SONG: {
      newState.song = action.payload;
      return newState;
    }
    case GET_REC_SONGS: {
      newState.songs = action.payload;
      return newState;
    }
    default:
      return newState;
  }
};
