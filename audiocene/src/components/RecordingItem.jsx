/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useRecordings } from "../contexts/RecordingsContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function RecordingItem({ recording }) {
  const { title, recording_date, id, position } = recording;
  const { deleteRecording } = useRecordings();

  function handleClick(e) {
    e.preventDefault();
    deleteRecording(id);
  }

  return (
    <li>
      <Link to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <h3>{title}</h3>
        <time>{formatDate(recording_date)}</time>
        <button onClick={handleClick}>&times;</button>
      </Link>
    </li>
  );
}

export default RecordingItem;
