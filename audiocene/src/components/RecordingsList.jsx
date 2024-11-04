/* eslint-disable react/prop-types */
import RecordingItem from "./RecordingItem";

import styled from "styled-components";
import { useCurrentBounds } from "../contexts/RecordingsByBoundsContext";
import { useRecordingsByMapBounds } from "../features/recordings/useRecordings";

const List = styled.ul`
  padding-inline-start: 0px;
`;

function RecordingsList() {
  const { currentBounds } = useCurrentBounds();
  const {
    loadingRecordingsByBounds,
    recordingsByBounds,
    recordingsByBoundsError,
  } = useRecordingsByMapBounds(currentBounds);

  if (loadingRecordingsByBounds) return <p>Loading</p>;
  if (recordingsByBoundsError)
    return <p>Error: {recordingsByBoundsError.message}</p>;
  return (
    <List>
      {recordingsByBounds.map((recording) => (
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
