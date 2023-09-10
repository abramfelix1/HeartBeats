import { csrfFetch } from "./csrf";

const GET_ALL_JOURNALS = "journals/GET_ALL_JOURNALS";
const GET_JOURNAL = "journals/GET_ALL_JOURNALS";
const CREATE_JOURNAL = "journals/CREATE_JOURNAL";
const UPDATE_JOURNAL = "journals/UPDATE_JOURNAL";
const DELETE_JOURNAL = "journals/DELETE_JOURNAL";
const RESET_JOURNALS = "journals/RESET_JOURNAL";
const JOURNAL_ADD_PLAYLIST = "journal/ADD_PLAYLIST";
const ADD_FILTERS = "journals/ADD_FILTERS";
const DELETE_FILTERS = "journals/DELETE_FILTERS";

export const getAllJournalsAction = (payload) => {
  return {
    type: GET_ALL_JOURNALS,
    payload,
  };
};

export const createJournalAction = (payload) => {
  return {
    type: CREATE_JOURNAL,
    payload,
  };
};

export const updateJournalAction = (payload) => {
  return {
    type: UPDATE_JOURNAL,
    payload,
  };
};

export const deleteJournalAction = (id) => {
  return {
    type: DELETE_JOURNAL,
    payload: {
      id: id,
    },
  };
};

export const resetJournalsActions = () => {
  return {
    type: RESET_JOURNALS,
  };
};

/* ADD PLAYLIST TO JOURNAL */
export const addPlaylistAction = (id, playlist) => {
  return {
    type: JOURNAL_ADD_PLAYLIST,
    payload: {
      id,
      playlist,
    },
  };
};

export const addFiltersAction = (payload) => {
  return {
    type: ADD_FILTERS,
    payload,
  };
};

export const deleteFiltersAction = (payload) => {
  return {
    type: DELETE_FILTERS,
    payload,
  };
};

/* GET ALL JOURNALS OF USER */
export const getAllJournals = () => async (dispatch) => {
  const res = await csrfFetch("/api/journals/session");

  if (res.ok) {
    const journals = await res.json();
    if (journals.journals) {
      journals.journals.forEach((journal) => {
        if (journal.filter) {
          for (let i = 0; i < 5; i++) {
            if (journal.filter[`filter${i + 1}`] !== null) {
              journal.filter[`filter${i + 1}`] = JSON.parse(
                journal.filter[`filter${i + 1}`]
              );
            }
          }
        }
      });
    }

    dispatch(getAllJournalsAction(journals));
    return journals;
  } else {
    const error = await res.json();
    error.log(error);
  }
};

/* CREATE JOURNAL */
export const createJournal = (payload) => async (dispatch) => {
  console.log("CREATE JOURNAL THUNK PAYLOAD: ", payload);
  const res = await csrfFetch("/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });

  if (res.ok) {
    const journal = await res.json();
    if (journal.journal.filter) {
      for (let i = 0; i < 5; i++) {
        if (journal.journal.filter[`filter${i + 1}`] !== null)
          journal.journal.filter[`filter${i + 1}`] = JSON.parse(
            journal.journal.filter[`filter${i + 1}`]
          );
      }
    }
    dispatch(createJournalAction(journal));
    return journal;
  }
};

/* UPDATE JOURNAL */
export const updateJournal = (id, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/journals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
  if (res.ok) {
    const journal = await res.json();
    if (journal.journal.filter) {
      for (let i = 0; i < 5; i++) {
        if (journal.journal.filter[`filter${i + 1}`] !== null)
          journal.journal.filter[`filter${i + 1}`] = JSON.parse(
            journal.journal.filter[`filter${i + 1}`]
          );
      }
    }

    dispatch(updateJournalAction(journal));
    return journal;
  }
};

/* DELETE JOURNAL */
export const deleteJournal = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/journals/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(deleteJournalAction(id));
    return data;
  }
};

/* ADD FILTERS */
export const createFilters = (id, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/filters/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
  if (res.ok) {
    const journal = await res.json();
    dispatch(addFiltersAction(journal));
    return journal;
  }
};

/* DELETE FILTERS */
export const deleteFilters = (id, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/filters/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
    }),
  });
  if (res.ok) {
    const journal = await res.json();
    dispatch(deleteFiltersAction(journal));
    return journal;
  }
};

const initialState = {};

export default function journalsReducer(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_JOURNALS: {
      console.log("ALL JOURNALS PAYLOAD:", action.payload);
      const journals = action.payload.journals.reduce((journals, journal) => {
        journals[journal.id] = journal;
        return journals;
      }, {});
      return journals;
    }
    case CREATE_JOURNAL: {
      console.log("CREATE JOURNALS PAYLOAD", action.payload);
      newState[action.payload.journal.id] = action.payload.journal;
      return newState;
    }
    case UPDATE_JOURNAL: {
      console.log("UPDATE JOURNALS PAYLOAD", action.payload);
      newState[action.payload.journal.id] = {
        ...newState[action.payload.journal.id],
        ...action.payload.journal,
      };
      return newState;
    }
    case DELETE_JOURNAL: {
      console.log("DELETE JOURNALS PAYLOAD", action.payload);
      delete newState[action.payload.id];
      return newState;
    }
    case JOURNAL_ADD_PLAYLIST: {
      console.log("ADD PLAYLIST TO JOURNAL PAYLOAD", action.payload);
      newState[action.payload.id] = {
        ...newState[action.payload.id],
        ...action.payload.playlist,
      };
      return newState;
    }
    case ADD_FILTERS: {
      console.log("ADD FILTERS PAYLOAD", action.payload);
      newState[action.payload.journal.id] = {
        ...newState[action.payload.journal.id],
        ...action.payload.journal,
      };
      return newState;
    }
    case DELETE_FILTERS: {
      console.log("DELETE FILTERS PAYLOAD", action.payload);
      newState[action.payload.journal.id] = {
        ...newState[action.payload.journal.id],
        ...action.payload.journal,
      };
      return newState;
    }
    case RESET_JOURNALS: {
      console.log("RESET JOURNALS");
      return initialState;
    }
    default:
      return state;
  }
}
