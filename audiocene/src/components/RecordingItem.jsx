/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecording } from "../services/apiRecordings";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function RecordingItem({ recording }) {
  const { title, recording_date, id, position } = recording;

  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteRecording,

    onSuccess: () => {
      alert("Recording deleted");
      queryClient.invalidateQueries({
        queryKey: ["recordings"],
      });
    },
    onError: (err) => alert(err.message),
  });

  return (
    <li>
      <Link to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <h3>{title}</h3>
        <time>{formatDate(recording_date)}</time>
      </Link>
      <button onClick={() => mutate(id)} disabled={isDeleting}>
        &times;
      </button>
    </li>
  );
}

export default RecordingItem;
