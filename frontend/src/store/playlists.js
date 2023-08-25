import { csrfFetch } from "./csrf";

const GET_ALL_PLAYLISTS = "playlists/GET_ALL_PLAYLISTS";
const GET_PLAYLIST = "playlists/GET_ALL_PLAYLISTS";
const CREATE_PLAYLIST = "playlists/CREATE_PLAYLIST";
const UPDATE_PLAYLIST = "playlists/UPDATE_PLAYLIST";
const DELETE_PLAYLIST = "playlists/DELETE_PLAYLIST";

export const getAllPlaylistsAction = (payload) => {
  return {
    type: GET_ALL_PLAYLISTS,
    payload,
  };
};

/* GET ALL PLAYLISTS OF USER */
export const getAllPlaylists = () => async (dispatch) => {
  const res = await csrfFetch("/api/playlists/session");

  if (res.ok) {
    const playlists = await res.json();
    dispatch(getAllPlaylistsAction(playlists));
    return playlists;
  }
};

const initialState = {};

export default function playlistsReducer(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_PLAYLISTS: {
      console.log("ALL PLAYLISTS PAYLOAD:", action.payload);
      const playlists = action.payload.playlists.reduce(
        (playlists, playlist) => {
          playlists[playlist.id] = playlist;
          return playlists;
        },
        {}
      );
      return playlists;
    }
    default:
      return state;
  }
}
