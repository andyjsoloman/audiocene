import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Map, { Marker, Popup } from "react-map-gl";

import { useGeoLocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPositon from "../hooks/useUrlPosition";
import { getRecordings } from "../services/apiRecordings";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

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

function MapGL() {
  const navigate = useNavigate();
  const {
    isLoading,
    data: recordings = [],
    error,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: getRecordings,
  });

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
  const [searchParams] = useSearchParams();
  const activeMarkerId = searchParams.get("id");

  const [viewState, setViewState] = useState({
    longitude: mapPosition[1],
    latitude: mapPosition[0],
    zoom: 2,
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

  const handleMapLoad = (map) => {
    // Set padding when the map is loaded
    map.setPadding({ top: 50, bottom: 50, left: 50, right: 500 });
    map.setFog({});
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
                    onClose={() => navigate(`/app/explore`)}
                  >
                    <span>{recording.title}</span>
                  </Popup>
                )}
              </Marker>
            ))}
        </Map>
      </MapCont>
      <Button onClick={getPosition} variant={"locate"}>
        {isLoadingPosition ? "Loading..." : "Get your position"}
      </Button>
    </>
  );
}

export default MapGL;
