/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function RecordingItem({ recording }) {
  const { title, date, id, position } = recording;
  return (
    <li>
      <Link to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <h3>{title}</h3>
        <time>{formatDate(date)}</time>
      </Link>
    </li>
  );
}

export default RecordingItem;
