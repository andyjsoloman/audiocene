/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useRecordings } from "../contexts/RecordingsContext";
import RecordingItem from "./RecordingItem";
import { getRecordings } from "../services/apiRecordings";

function RecordingsList() {
  const {
    isLoading,
    data: recordings,
    error,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: getRecordings,
  });

  console.log(recordings);

  if (isLoading) return <p>Loading</p>;
  return (
    <ul>
      {recordings.map((recording) => (
        <RecordingItem recording={recording} key={recording.id} />
      ))}
    </ul>
  );
}

export default RecordingsList;
