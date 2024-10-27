import { useRecordings } from "../features/recordings/useRecordings";
import RecordingItem from "./RecordingItem";
import styled from "styled-components";

const List = styled.ul`
  padding-inline-start: 0px;
`;

function UserRecordings({ userId, renderedBy }) {
  const { loadingRecordings, recordingsError, recordings } =
    useRecordings(userId);

  if (loadingRecordings) return <p>Loading</p>;
  if (recordingsError) return <p>Error: {recordingsError.message}</p>;
  return (
    <List>
      {recordings.map((recording) => (
        <RecordingItem
          recording={recording}
          key={recording.id}
          renderedBy={renderedBy}
        />
      ))}
    </List>
  );
}

export default UserRecordings;
