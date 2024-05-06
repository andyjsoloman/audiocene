import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";

const RecordingsContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
  recordings: [],
  isLoading: false,
  currentRecording: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "recordings/loaded":
      return {
        ...state,
        isLoading: false,
        recordings: action.payload,
      };

    case "recording/loaded":
      return { ...state, isLoading: false, currentRecording: action.payload };

    case "recording/created":
      return {
        ...state,
        isLoading: false,
        recordings: [...state.recordings, action.payload],
        currentRecording: action.payload,
      };

    case "recording/deleted":
      return {
        ...state,
        isLoading: false,
        recordings: state.recordings.filter(
          (recording) => recording.id !== action.payload
        ),
        currentRecording: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function RecordingsProvider({ children }) {
  const [{ recordings, isLoading, currentRecording }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [recordings, setRecordings] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentRecording, setCurrentRecording] = useState({});

  useEffect(function () {
    async function fetchRecordings() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/recordings`);
        const data = await res.json();

        dispatch({ type: "recordings/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Error loading recording data" });
      }
    }

    fetchRecordings();
  }, []);

  async function getRecording(id) {
    if (Number(id) === currentRecording.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/recordings/${id}`);
      const data = await res.json();
      dispatch({ type: "recording/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error loading recording data" });
    }
  }

  async function createRecording(newRecording) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/recordings`, {
        method: "POST",
        body: JSON.stringify(newRecording),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "recording/created", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error creating the recording" });
    }
  }

  async function deleteRecording(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/recordings/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "recording/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Error deleting the recording" });
    }
  }

  return (
    <RecordingsContext.Provider
      value={{
        recordings,
        isLoading,
        currentRecording,
        getRecording,
        createRecording,
        deleteRecording,
      }}
    >
      {children}
    </RecordingsContext.Provider>
  );
}

function useRecordings() {
  const context = useContext(RecordingsContext);
  if (context === undefined)
    throw new Error(
      "RecordingsContext was used outside of the RecordingsProvider"
    );
  return context;
}

export { RecordingsProvider, useRecordings };
