import { csrfFetch } from "./csrf";

const GET_ALL_JOURNALS = "journals/GET_ALL_JOURNALS";
const GET_JOURNAL = "journals/GET_ALL_JOURNALS";
const CREATE_JOURNAL = "journals/CREATE_JOURNAL";
const UPDATE_JOURNAL = "journals/UPDATE_JOURNAL";
const DELETE_JOURNAL = "journals/DELETE_JOURNAL";

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

/* GET ALL JOURNALS OF USER */
export const getAllJournals = () => async (dispatch) => {
  const res = await csrfFetch("/api/journals/session");

  if (res.ok) {
    const journals = await res.json();
    dispatch(getAllJournalsAction(journals));
    return journals;
  }
};

/* CREATE JOURNAL */
export const createJournal = () => async (dispatch) => {
  const res = await csrfFetch("/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const journal = await res.json();
    dispatch(createJournalAction(journal));
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
      console.log("STATE:", newState);
      console.log("CREATE JOURNALS PAYLOAD", action.payload);
      newState[action.payload.journal.id] = {
        ...action.payload.journal,
        playlist: null,
      };
      return newState;
    }
    default:
      return state;
  }
}
