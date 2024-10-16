import { useRecordings } from "../features/recordings/useRecordings";
import RecordingItem from "./RecordingItem";

function UserRecordings({ userId }) {
  const { isLoading, error, recordings } = useRecordings(userId);

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

export default UserRecordings;
