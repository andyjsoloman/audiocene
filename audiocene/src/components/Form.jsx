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
import styled from "styled-components";
import FormRow from "./FormRow";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const LocationInfo = styled.div`
  display: grid;
  align-items: center;

  grid-template-columns: 8rem 1fr 1.2fr;
  gap: 0.4rem;

  padding: 0.2rem 0;

  label {
    font-weight: 500;
  }
`;

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

  const { register, handleSubmit, control, setValue, reset, formState } =
    useForm();

  const { errors } = formState;

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

  function onError(error) {}

  if (isLoadingGeocoding) return <LoadingSpinner />;
  if (!lat && !lng) return <p>Start by clicking somewhere on the map</p>;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <LocationInfo>
        <label htmlFor="locality">Locality:</label>
        <p className="inline">{locality}</p>
        <input id="locality" type="hidden" {...register("locality")} />
      </LocationInfo>
      <LocationInfo>
        <label htmlFor="country">Country:</label>
        <p className="inline">{country}</p>
        <input id="country" type="hidden" {...register("country")} />
      </LocationInfo>
      <input type="hidden" {...register("lat")} />
      <input type="hidden" {...register("lng")} />

      <FormRow label="Recording Title" error={errors?.title?.message}>
        <input
          id="title"
          defaultValue=""
          {...register("title", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Notes">
        <textarea id="notes" defaultValue="" {...register("notes")} />
      </FormRow>
      <FormRow label="Date of Recording">
        <Controller
          id="date"
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
      </FormRow>

      <Button disabled={isCreating}>Add Recording</Button>
    </form>
  );
}
