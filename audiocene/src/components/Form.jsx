import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecording } from "../services/apiRecordings";
import toast from "react-hot-toast";
import useUrlPositon from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import Message from "./Message";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export default function Form() {
  const queryClient = useQueryClient();
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createRecording,
    onSuccess: () => {
      toast.success("New recording created");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, control, setValue, reset } = useForm();

  const navigate = useNavigate();
  const [lat, lng] = useUrlPositon();
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeoCoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchRecordingData() {
      try {
        setIsLoadingGeoCoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        setLocality(data.locality || "");
        setCountry(data.countryName || "");
        setValue("locality", data.locality || "");
        setValue("country", data.countryName || "");
        setValue("lat", lat);
        setValue("lng", lng);
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }

    fetchRecordingData();
  }, [lat, lng, setValue]);

  function onSubmit(data) {
    const { lat, lng, ...recordingData } = data;
    recordingData.position = { lat, lng };
    mutate(recordingData);
  }

  if (isLoadingGeocoding) return <LoadingSpinner />;
  if (!lat && !lng) return <p>Start by clicking somewhere on the map</p>;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Recording Title</label>
        <input id="title" defaultValue="" {...register("title")} />
      </div>
      <div>
        <label htmlFor="locality" className="inline">
          Locality:
        </label>
        <p className="inline">{locality}</p>
        <input id="locality" type="hidden" {...register("locality")} />
      </div>
      <div>
        <label htmlFor="country" className="inline">
          Country:
        </label>
        <p className="inline">{country}</p>
        <input id="country" type="hidden" {...register("country")} />
      </div>
      <input type="hidden" {...register("lat")} />
      <input type="hidden" {...register("lng")} />
      <div>
        <label htmlFor="date">Date of Recording</label>
        <Controller
          control={control}
          name="date"
          defaultValue={new Date()}
          render={({ field }) => (
            <DatePicker
              id="date"
              selected={field.value}
              onChange={field.onChange}
              dateFormat="dd/MM/yyyy"
            />
          )}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" defaultValue="" {...register("notes")} />
      </div>
      <Button disabled={isCreating}>Add Recording</Button>
    </form>
  );
}
