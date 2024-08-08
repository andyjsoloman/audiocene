/* eslint-disable react/prop-types */
import RecordingItem from "./RecordingItem";
import { useRecordings } from "../features/recordings/useRecordings";

function RecordingsList() {
  const { isLoading, error, recordings } = useRecordings();

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
