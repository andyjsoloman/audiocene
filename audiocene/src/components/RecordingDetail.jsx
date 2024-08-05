import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import BackButton from "./BackButton";
import { getRecordingById } from "../services/apiRecordings";

function Recording() {
  const { id } = useParams();

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
      <div>Recording Info for {id}</div>
      <div>Recorded at {formatDate(recording.date)}</div>

      <BackButton />
    </>
  );
}

export default Recording;
