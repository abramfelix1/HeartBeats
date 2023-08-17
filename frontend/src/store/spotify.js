import { csrfFetch } from "./csrf";

export const getSpotifyUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/spotify/session", {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
  }
};
