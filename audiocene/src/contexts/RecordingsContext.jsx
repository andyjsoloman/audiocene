import { createContext, useState, useEffect, useContext } from "react";

const RecordingsContext = createContext();

const BASE_URL = "http://localhost:8000";

function RecordingsProvider({ children }) {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecording, setCurrentRecording] = useState({});

  useEffect(function () {
    async function fetchRecordings() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/recordings`);
        const data = await res.json();
        setRecordings(data);
      } catch {
        alert("Error loading recording data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecordings();
  }, []);

  async function getRecording(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/recordings/${id}`);
      const data = await res.json();
      setCurrentRecording(data);
    } catch {
      alert("Error loading recording data");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <RecordingsContext.Provider
      value={{ recordings, isLoading, currentRecording, getRecording }}
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
