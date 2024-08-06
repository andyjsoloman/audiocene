import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { getRecordingById } from "../services/apiRecordings";
import Button from "./Button";
import styled from "styled-components";
import Form from "./Form";

const DetailPanel = styled.div`
  position: flex;
`;

function RecordingDetail() {
  const { id } = useParams();

  const [showForm, setShowForm] = useState(false);

  const {
    isLoading,
    data: recording,
    error,
  } = useQuery({
    queryKey: ["recording", id],
    queryFn: () => getRecordingById(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
        <audio controls src={recording.audio}></audio>
        <div>Recording Info for {id}</div>
        <div>Recorded at {formatDate(recording.date)}</div>
        <div>
          {recording.locality}, {recording.country}
        </div>

        <Button onClick={() => setShowForm((show) => !show)}>
          {showForm ? "Cancel" : "Edit"}
        </Button>

        <BackButton />
      </DetailPanel>
      {showForm && <Form recordingToEdit={recording} />}
    </>
  );
}

export default RecordingDetail;
