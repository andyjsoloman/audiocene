import { useRecordings } from "../features/recordings/useRecordings";
import RecordingItem from "./RecordingItem";

function UserRecordings({ userId }) {
  const { loadingRecordings, recordingsError, recordings } =
    useRecordings(userId);

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

export default UserRecordings;
