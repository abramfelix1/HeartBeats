import { csrfFetch } from "./csrf";

//store value as key in session reducer later
export const getSpotifyUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/spotify/session", {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    console.log("SPOTIFY USER ACCOUNT", data);
  }
};
