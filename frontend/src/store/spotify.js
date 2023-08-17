import { csrfFetch } from "./csrf";
export const GET_SPOTIFY = "spotify/GET_SPOTIFY";

export const getSpotifyUserAction = (payload) => {
  return {
    type: GET_SPOTIFY,
    payload,
  };
};

//store value as key in session reducer later
export const getSpotifyUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/spotify/session", {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    await dispatch(getSpotifyUserAction(data));
    console.log("SPOTIFY USER ACCOUNT", data);
  }
};
