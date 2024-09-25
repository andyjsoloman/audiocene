/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useDeleteRecording } from "../features/recordings/useDeleteRecording";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import Button from "./Button";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function RecordingItem({ recording }) {
  const { title, date, id, position, audio } = recording;

  const { isDeleting, deleteRecording } = useDeleteRecording();
  const { setCurrentRecordingId } = useCurrentlyPlaying();

  return (
    <li>
      <Link to={`${id}?id=${id}&lat=${position.lat}&lng=${position.lng}`}>
        <h3>{title}</h3>
        <time>{formatDate(date)}</time>
      </Link>
      <Button onClick={() => setCurrentRecordingId(id)}>Play</Button>
      <button onClick={() => deleteRecording(id)} disabled={isDeleting}>
        &times;
      </button>
    </li>
  );
}

export default RecordingItem;
