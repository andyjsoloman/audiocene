/* eslint-disable react/prop-types */
import { useRecordings } from "../contexts/RecordingsContext";
import RecordingItem from "./RecordingItem";

function RecordingsList() {
  const { recordings, isLoading } = useRecordings();

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
