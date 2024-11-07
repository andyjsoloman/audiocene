/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import Button from "./Button";
import Message from "./Message";
import LoadingSpinner from "./LoadingSpinner";
import FormRow from "./FormRow";

import useUrlPositon from "../hooks/useUrlPosition";
import { Controller, useForm } from "react-hook-form";

import { useCreateRecording } from "../features/recordings/useCreateRecording";
import { useEditRecording } from "../features/recordings/useEditRecording";
import FileInput from "./FileInput";

// const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY;

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

const Input = styled.input`
  &::file-selector-button {
    /* background-color: var(--color-primary);
    
    border-style: none;
    box-sizing: border-box;
    color: var(--color-bg); */

    cursor: pointer;
    display: inline-block;
    font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
      source-sans-pro, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    line-height: 20px;
    list-style: none;
    margin-right: 12px;
    /* outline: none; */
    padding: 10px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: color 100ms;
    vertical-align: baseline;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    min-width: max-content;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
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

  const { isCreating, createRecording } = useCreateRecording();

  const { isEditing, editRecording } = useEditRecording();

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

    function getPreferredLocation(features) {
      const preferredTypes = ["place", "locality", "region"];

      for (let type of preferredTypes) {
        const matchedFeature = features.find((feature) =>
          feature.place_type.includes(type)
        );
        if (matchedFeature) {
          return matchedFeature.text;
        }
      }
      return "Unknown Location";
    }

    function getCountry(features) {
      const countryFeature = features.find((feature) =>
        feature.place_type.includes("country")
      );
      return countryFeature ? countryFeature.place_name : "Country not found";
    }

    async function fetchRecordingData() {
      try {
        setIsLoadingGeoCoding(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
        );

        const data = await res.json();

        const locationName = getPreferredLocation(data.features);

        const countryName = getCountry(data.features);

        setLocality(locationName || "Unknown Region");
        setCountry(countryName || "Unknown Country");
        setValue("locality", locationName || "Unknown Region");
        setValue("country", countryName || "Unknown Country");
        setValue("lat", lat);
        setValue("lng", lng);
      } catch (err) {
        setGeocodingError(err.message);
        console.log(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }

    fetchRecordingData();
  }, [lat, lng, setValue]);

  function onSubmit(data) {
    const audio = typeof data.audio === "string" ? data.audio : data.audio[0];

    const image = data.image[0];

    if (isEditSession) {
      delete data.lat;
      delete data.lng;
      editRecording(
        { newRecordingData: { ...data, audio, image }, id: editId },
        {
          onSuccess: (data) => reset(),
        }
      );
    } else {
      const { lat, lng, ...recordingData } = data;
      recordingData.position = { lat, lng };

      createRecording(
        { ...recordingData, audio: audio, image: image },
        {
          onSuccess: (data) => reset(),
        }
      );
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
        <Input
          id="title"
          defaultValue=""
          disabled={isWorking}
          {...register("title", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Audio File" error={errors?.title?.message}>
        <FileInput
          id="audio"
          defaultValue=""
          type="file"
          accept="audio/*"
          {...register("audio", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Photo (optional)" error={errors?.title?.message}>
        <FileInput
          id="image"
          defaultValue=""
          type="file"
          accept="image/*"
          {...register("image")}
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
      <ButtonRow>
        <Button disabled={isCreating}>
          {isEditing
            ? "Loading"
            : isEditSession
            ? "Save Changes"
            : "Add Recording"}
        </Button>
      </ButtonRow>
    </form>
  );
}
