import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BackButton from "./BackButton";
import { getRecordingById } from "../services/apiRecordings";
import { getProfileById } from "../services/apiProfiles"; // Updated import
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import Button from "./Button";
import styled from "styled-components";
import Form from "./Form";

const DetailPanel = styled.div`
  position: flex;
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

function RecordingDetail() {
  const { id } = useParams();
  const { setCurrentRecordingId } = useCurrentlyPlaying();
  const [showForm, setShowForm] = useState(false);

  const {
    isLoading,
    data: recording,
    error,
  } = useQuery({
    queryKey: ["recording", id],
    queryFn: () => getRecordingById(id),
  });

  const {
    data: user,
    error: userError,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user", recording?.user_id],
    queryFn: () => {
      if (recording && recording.user_id) {
        return getProfileById(recording.user_id); // Fetch profile for the specific user
      }
      return null; // Prevent fetching if recording is not available
    },
    enabled: !!recording && !!recording.user_id, // Only fetch if the recording data and user_id are available
  });

  if (isLoading || loadingUser) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (userError) {
    return <div>Error fetching user: {userError.message}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <>
      <DetailPanel>
        <Title>{recording.title}</Title>
        <div>Recorded at {formatDate(recording.date)}</div>
        <div>
          {recording.locality}, {recording.country}
        </div>
        {user && <div>Uploaded by: {user.display_name}</div>}{" "}
        {/* Updated to access the first user */}
        <ButtonRow>
          <BackButton />
          <Button onClick={() => setCurrentRecordingId(id)}>Play</Button>
          <Button onClick={() => setShowForm((show) => !show)}>
            {showForm ? "Cancel" : "Edit"}
          </Button>
        </ButtonRow>
      </DetailPanel>
      {showForm && <Form recordingToEdit={recording} />}
    </>
  );
}

export default RecordingDetail;
