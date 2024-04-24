import { useParams, useSearchParams } from "react-router-dom";
import { useRecordings } from "../contexts/RecordingsContext";
import { useEffect } from "react";
import BackButton from "./BackButton";

function Recording() {
  const { id } = useParams();

  const { getRecording, currentRecording, isLoading } = useRecordings();

  useEffect(
    function () {
      getRecording(id);
    },
    [id]
  );

  if (isLoading) return null;

  return (
    <>
      <div>Recording Info for {id}</div>
      <BackButton />
    </>
  );
}

export default Recording;
