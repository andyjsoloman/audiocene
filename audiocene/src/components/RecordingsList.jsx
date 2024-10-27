/* eslint-disable react/prop-types */
import RecordingItem from "./RecordingItem";
import { useRecordings } from "../features/recordings/useRecordings";
import styled from "styled-components";

const List = styled.ul`
  padding-inline-start: 0px;
`;

function RecordingsList() {
  const { loadingRecordings, recordingsError, recordings } = useRecordings();

  if (loadingRecordings) return <p>Loading</p>;
  if (recordingsError) return <p>Error: {recordingsError.message}</p>;
  return (
    <List>
      {recordings.map((recording) => (
        <RecordingItem
          recording={recording}
          key={recording.id}
          renderedBy="app"
        />
      ))}
    </List>
  );
}

export default RecordingsList;
