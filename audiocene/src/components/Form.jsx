import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import Button from "./Button";
import Message from "./Message";
import LoadingSpinner from "./LoadingSpinner";
import FormRow from "./FormRow";

import useUrlPositon from "../hooks/useUrlPosition";
import { createEditRecording } from "../services/apiRecordings";
import { Controller, useForm } from "react-hook-form";

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

export default function Form({ recordingToEdit = {} }) {
  const { id: editId, ...editValues } = recordingToEdit;

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, control, setValue, reset, formState } =
    useForm({
      defaultValues: isEditSession
        ? { ...editValues, date: new Date(editValues.date) }
        : {},
    });

  const queryClient = useQueryClient();

  const { mutate: createRecording, isLoading: isCreating } = useMutation({
    mutationFn: createEditRecording,
    onSuccess: () => {
      toast.success("New recording created");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: editRecording, isLoading: isEditing } = useMutation({
    mutationFn: ({ newRecordingData, id }) =>
      createEditRecording(newRecordingData, id),
    onSuccess: () => {
      toast.success("Recording successfully edited");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

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
    const audio = typeof data.audio === "string" ? data.audio : data.audio[0];

    if (isEditSession) {
      delete data.lat;
      delete data.lng;
      editRecording({ newRecordingData: { ...data, audio }, id: editId });
    } else {
      const { lat, lng, ...recordingData } = data;
      recordingData.position = { lat, lng };

      createRecording({ ...recordingData, audio: audio });
    }
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
          disabled={isWorking}
          {...register("title", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Audio File" error={errors?.title?.message}>
        <input
          id="audio"
          defaultValue=""
          type="file"
          accept="audio/*"
          {...register("audio", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Notes">
        <textarea
          id="notes"
          defaultValue=""
          disabled={isWorking}
          {...register("notes")}
        />
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
              dateFormat="MMM d, yyyy h:mm aa"
              showTimeSelect
              disabled={isWorking}
            />
          )}
        />
      </FormRow>

      <Button disabled={isCreating}>
        {isEditSession ? "Save Changes" : "Add Recording"}
      </Button>
    </form>
  );
}
