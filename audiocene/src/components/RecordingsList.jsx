/* eslint-disable react/prop-types */
import RecordingItem from "./RecordingItem";
import { useRecordings } from "../features/recordings/useRecordings";

function RecordingsList() {
  const { loadingRecordings, recordingsError, recordings } = useRecordings();

  if (loadingRecordings) return <p>Loading</p>;
  if (recordingsError) return <p>Error: {recordingsError.message}</p>;
  return (
    <ul>
      {recordings.map((recording) => (
        <RecordingItem recording={recording} key={recording.id} />
      ))}
    </ul>
  );
}

export default RecordingsList;
