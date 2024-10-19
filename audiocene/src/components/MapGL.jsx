import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGeoLocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPositon from "../hooks/useUrlPosition";

import { useRecordings } from "../features/recordings/useRecordings";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_KEY;

const MapCont = styled.div`
  height: 600px;
  width: 100%;
  flex: 1;
  z-index: 1;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--color-dkgrey);
`;

const PopupContent = styled.span`
  padding: 8px;
  font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
    source-sans-pro, sans-serif;
  font-size: 10px;
  font-weight: 300;
`;

const GeolocateContainer = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 4rem;
  left: 30%;
`;

export default function MapGL() {
  const navigate = useNavigate();

  const { loadingRecordings, recordingsError, recordings } = useRecordings();

  const [mapPosition, setMapPosition] = useState([
    50.71733015526967, 1.8731689453125002,
  ]); // DEFAULT MAP POSITION
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapLat, mapLng] = useUrlPositon();
  const markerRefs = useRef({});
  const [done, setDone] = useState(false);
  const [tempLat, setTempLat] = useState(null);
  const [tempLng, setTempLng] = useState(null);
  const [searchParams] = useSearchParams();
  const activeMarkerId = searchParams.get("id");

  const [viewState, setViewState] = useState({
    longitude: mapPosition[1],
    latitude: mapPosition[0],
    zoom: 3,
  });

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
      setViewState({
        ...viewState,
        longitude: mapLng,
        latitude: mapLat,
      });
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      setViewState({
        ...viewState,
        longitude: geolocationPosition.lng,
        latitude: geolocationPosition.lat,
      });
      navigate(
        `?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
      );
    }
  }, [geolocationPosition, navigate]);

  useEffect(() => {
    if (activeMarkerId && done) {
      const markerToOpen = markerRefs.current[activeMarkerId];
      if (markerToOpen) {
        markerToOpen.togglePopup();
      }
    }
  }, [activeMarkerId, done]);

  useEffect(() => {
    if (!location.pathname.includes("/add")) {
      setTempLat(null);
      setTempLng(null);
    }
  }, [searchParams]);

  const handleMapLoad = (map) => {
    // Set padding when the map is loaded
    map.setPadding({ top: 50, bottom: 50, left: 50, right: 500 });
    map.setFog({
      "horizon-blend": 0.3,
      "high-color": "#a1d7e9",
      "space-color": "#0c3947",
      "star-intensity": 1.0,
    });
  };

  const handleMapClick = async (event) => {
    if (event.originalEvent.target.closest(".mapboxgl-marker")) {
      return; // Click target was a marker so do nothing…
    }
    const { lng, lat } = event.lngLat;

    setTempLng(lng);
    setTempLat(lat);
    navigate(`add?lat=${lat}&lng=${lng}`);
  };

  return (
    <>
      <MapCont>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          projection="globe"
          onLoad={(evt) => handleMapLoad(evt.target)}
          onClick={handleMapClick}
        >
          {Array.isArray(recordings) &&
            recordings.map((recording, index) => (
              <Marker
                key={recording.id}
                longitude={recording.position.lng}
                latitude={recording.position.lat}
                anchor="bottom"
                onClick={() =>
                  navigate(
                    `explore/${recording.id}?id=${recording.id}&lat=${recording.position.lat}&lng=${recording.position.lng}`
                  )
                }
              >
                <img
                  src="/mapMarker.svg"
                  alt="Marker"
                  style={{ width: 45, height: 60 }}
                />
                {activeMarkerId === String(recording.id) && (
                  <Popup
                    longitude={recording.position.lng}
                    latitude={recording.position.lat}
                    closeOnClick={false}
                    offset={[0, -60]}
                    onClose={() => navigate(`/app/explore`)}
                  >
                    <PopupContent>{recording.title}</PopupContent>
                  </Popup>
                )}
              </Marker>
            ))}
          {tempLat && (
            <Marker longitude={tempLng} latitude={tempLat} anchor="bottom">
              <img
                src="/mapMarkerAdd.svg"
                alt="New Recording Marker"
                style={{ width: 45, height: 60 }}
              />
            </Marker>
          )}
        </Map>

        <GeolocateContainer>
          <Button onClick={getPosition} variant={"secondary"}>
            {isLoadingPosition ? "Loading..." : "Get your position"}
          </Button>
        </GeolocateContainer>
      </MapCont>
    </>
  );
}
