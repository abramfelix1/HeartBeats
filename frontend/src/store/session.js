import { csrfFetch } from "./csrf";
import * as spotifyActions from "./spotify";

// Action Type
const SET_SESSION_USER = "session/SET_SESSION_USER";
const CLEAR_SESSION_USER = "session/CLEAR_SESSION_USER";

// Action Creators
const setSessionUser = (user) => ({
  type: SET_SESSION_USER,
  payload: user,
});

const clearSessionUser = () => ({
  type: CLEAR_SESSION_USER,
});

const refreshSpotifyClientToken = async (dispatch) => {
  dispatch(spotifyToken());
  setTimeout(() => refreshSpotifyClientToken(dispatch), 40 * 60 * 1000);
};

// Thunk action creators
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("LOGIN DaTA:", data);
    dispatch(setSessionUser(data.user));
    dispatch(spotifyToken());
    setTimeout(() => refreshSpotifyClientToken(dispatch), 40 * 60 * 1000);
    return response;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  }
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    dispatch(spotifyToken());

    setTimeout(() => refreshSpotifyClientToken(dispatch), 40 * 60 * 1000);

    return response;
  }
};

let tokenRefreshTimeout = null;

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(clearSessionUser());
    clearTimeout(tokenRefreshTimeout);
    return response;
  }
};

/* SPOTIFY SESSION THUNKS */

export const spotifyLogin = () => async (dispatch) => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://heart-beats.onrender.com/api/spotify/login"
      : "http://localhost:8000/api/spotify/login";

  window.location.href = url;
};

export const spotifyToken = () => async (dispatch) => {
  await csrfFetch("/api/spotify/public_token");
};

//FIGURE THIS OUT LATER, MAYBE MAKE TIMER TO CALL EVERY HOUR IF STILL LOGGED ON SPOTIFY ACCCOUNT
export const refreshSpotifyToken = () => async (dispatch) => {
  const response = await csrfFetch("/api/spotify/refresh_token", {
    method: "GET",
    // credentials: "include",
  });
  // console.log("TEST REFRESH!!!!");
  if (response.ok) {
    const data = await response.json();
    // console.log("Refresh Token:", data);
    return data;
  } else return "ASDF";
};

export const checkLoggedIn = () => async (dispatch) => {
  const response = await fetch("/api/session/user");
  if (response.ok) {
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  }
};

// Initial state
const initialState = {
  user: null,
  spotifyInfo: null,
};

// Reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_SESSION_USER:
      newState = Object.assign({}, state);
      const user = { spotifyId: null };
      newState.user = { ...user, ...action.payload };
      return newState;
    case CLEAR_SESSION_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      newState.spotify = null;
      return newState;
    case spotifyActions.GET_SPOTIFY:
      newState = { ...state, spotifyInfo: action.payload };
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
