import { csrfFetch } from "./csrf";

const GET_ALL_PLAYLISTS = "playlists/GET_ALL_PLAYLISTS";
const GET_PLAYLIST = "playlists/GET_PLAYLISTS";
const CREATE_PLAYLIST = "playlists/CREATE_PLAYLIST";
const UPDATE_PLAYLIST = "playlists/UPDATE_PLAYLIST";
const DELETE_PLAYLIST = "playlists/DELETE_PLAYLIST";
const RESET_PLAYLIST = "playlist/RESET_PLAYLIST";
const ADD_SONG_TO_PLAYLIST = "playlist/ADD_SONG_TO_PLAYLIST";
const REMOVE_SONG_FROM_PLAYLIST = "playlist/REMOVE_SONG_FROM_PLAYLIST";

export const getAllPlaylistsAction = (payload) => {
  return {
    type: GET_ALL_PLAYLISTS,
    payload,
  };
};

export const getPlaylistAction = (payload) => {
  return {
    type: GET_PLAYLIST,
    payload,
  };
};

export const createPlaylistAction = (payload) => {
  return {
    type: CREATE_PLAYLIST,
    payload,
  };
};

export const updatePlaylistAction = (payload) => {
  return {
    type: UPDATE_PLAYLIST,
    payload,
  };
};

export const deletePlaylistAction = (id) => {
  return {
    type: DELETE_PLAYLIST,
    payload: {
      id: id,
    },
  };
};

export const addSongToPlaylistAction = (playlist) => ({
  type: ADD_SONG_TO_PLAYLIST,
  payload: playlist,
});

export const removeSongFromPlaylistAction = (playlist) => ({
  type: REMOVE_SONG_FROM_PLAYLIST,
  payload: playlist,
});

export const resetPlaylistAction = () => {
  return {
    type: RESET_PLAYLIST,
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

/* GET A PLAYLIST */
export const getPlaylist = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/playlists/${id}`);
  if (res.ok) {
    const playlist = await res.json();
    dispatch(getPlaylistAction(playlist));
    return playlist;
  }
};

/* CREATE PLAYLIST */
export const createPlaylist = (journalId) => async (dispatch) => {
  const res = await csrfFetch(`/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      journalId: journalId,
    }),
  });
  if (res.ok) {
    const playlist = await res.json();
    dispatch(createPlaylistAction(playlist));
    return playlist;
  }
};

/* UPDATE PLAYLIST */
export const updatePlaylist = (id, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/playlists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
  if (res.ok) {
    const playlist = await res.json();
    dispatch(updatePlaylistAction(playlist));
    return playlist;
  }
};

/* DELETE PLAYLIST */
export const deletePlaylist = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/playlists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const playlist = await res.json();
    dispatch(deletePlaylistAction(id));
    return playlist;
  }
};

/* CREATE SONG */
export const createSong = (payload) => async (dispatch) => {
  await csrfFetch(`/api/songs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
};

/* ADD SONG TO PLAYLIST */
export const addSongToPlaylist =
  (playlistId, songId, payload) => async (dispatch) => {
    const res = await csrfFetch(`/api/playlists/${playlistId}/add/${songId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addSongToPlaylistAction(data.playlist));
    }
  };

/* REMOVE SONG FROM PLAYLIST */
export const removeSongFromPlaylist =
  (playlistId, songId) => async (dispatch) => {
    const res = await csrfFetch(
      `/api/playlists/${playlistId}/remove/${songId}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      const data = await res.json();
      dispatch(removeSongFromPlaylistAction(data.playlist));
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
    case GET_PLAYLIST: {
      console.log("GET PLAYLIST PAYLOAD:", action.payload);
      // newState[action.payload.playlist.id] = action.payload.playlist;
      // return newState;
      return action.payload;
    }
    case CREATE_PLAYLIST: {
      console.log("CREATE PLAYLIST PAYLOAD:", action.payload);
      newState[action.payload.playlist.id] = action.payload.playlist;
      return newState;
    }
    case UPDATE_PLAYLIST: {
      console.log("UPDATE PLAYLIST PAYLOAD:", action.payload);
      newState[action.payload.playlist.id] = {
        ...newState[action.payload.playlist.id],
        ...action.payload.playlist,
      };
      return newState;
    }
    case DELETE_PLAYLIST: {
      console.log("DELETE PLAYLIST PAYLOAD:", action.payload);
      delete newState[action.payload.id];
      return newState;
    }
    case ADD_SONG_TO_PLAYLIST: {
      console.log("ADD SONG TO PLAYLIST PAYLOAD:", action.payload);
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case REMOVE_SONG_FROM_PLAYLIST: {
      console.log("REMOVE SONG FROM PLAYLIST PAYLOAD:", action.payload);
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case RESET_PLAYLIST: {
      return initialState;
    }
    default:
      return state;
  }
}
