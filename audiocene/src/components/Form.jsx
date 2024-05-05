import useUrlPositon from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import Message from "./Message";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export default function Form() {
  const [lat, lng] = useUrlPositon();
  const [recordingTitle, setRecordingTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [isLoadingGeocoding, setIsLoadingGeoCoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      async function fetchRecordingData() {
        try {
          setIsLoadingGeoCoding(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);
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

  function handleSubmit() {
    console.log("SUBMIT");
  }

  if (isLoadingGeocoding) return <LoadingSpinner />;

  if (!lat && !lng) return <p>Start by clicking somewhere on the map </p>;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="recordingTitle">Recording Title</label>
        <input
          id="recordingTitle"
          onChange={(e) => setRecordingTitle(e.target.value)}
          value={recordingTitle}
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
