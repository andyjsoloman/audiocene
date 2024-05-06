import useUrlPositon from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import Message from "./Message";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRecordings } from "../contexts/RecordingsContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export default function Form() {
  const { createRecording, isLoading } = useRecordings();
  const navigate = useNavigate();
  const [lat, lng] = useUrlPositon();
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [isLoadingGeocoding, setIsLoadingGeoCoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchRecordingData() {
        try {
          setIsLoadingGeoCoding(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          setLocality(data.locality || "");
          setCountry(data.countryName || "");
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchRecordingData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) return;
    const newRecording = {
      title,
      locality,
      country,
      date,
      description: notes,
      position: { lat, lng },
    };
    await createRecording(newRecording);
    navigate("/app/explore");
  }

  if (isLoadingGeocoding) return <LoadingSpinner />;

  if (!lat && !lng) return <p>Start by clicking somewhere on the map </p>;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Recording Title</label>
        <input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div>
        <label htmlFor="locality">Locality</label>
        <input
          id="recordingTitle"
          onChange={(e) => setLocality(e.target.value)}
          value={locality}
        />
      </div>
      <div>
        <label htmlFor="recordingDate">Date of Recording</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>
      <Button>Add Recording</Button>
    </form>
  );
}
