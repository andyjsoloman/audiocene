/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
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
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {recordings.map((recording) => (
        <RecordingItem recording={recording} key={recording.id} />
      ))}
    </ul>
  );
}

export default RecordingsList;
