import {
  MapContainer as BaseMapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import * as L from "leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import { useState, useEffect, useRef } from "react"; // <-- Added useRef
import { useGeoLocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPositon from "../hooks/useUrlPosition";
import { getRecordings } from "../services/apiRecordings";
import LoadingSpinner from "./LoadingSpinner";

const StyledMapContainer = styled(BaseMapContainer)`
  height: 100%;
  width: 100%; // Ensuring it takes up all the available width too
  z-index: 1;
`;

const MapCont = styled.div`
  height: 600px;
  width: 100%;
  flex: 1;
  z-index: 1;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--color-dkgrey);
`;

const mapIcon = L.icon({
  iconUrl: "/mapMarker.svg",
  iconSize: [45, 60],
  iconAnchor: [22, 60],
  popupAnchor: [5, -40],
  //   shadowUrl: "my-icon-shadow.png",
  //   shadowSize: [68, 95],
  //   shadowAnchor: [22, 94],
});

function Map() {
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
  ]); //DEFAULT MAP POSITION
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapLat, mapLng] = useUrlPositon();

  const markerRefs = useRef({}); // <-- Added ref object to hold marker references
  const [done, setDone] = useState(false); // <-- Added state to track when refs are ready
  const [searchParams] = useSearchParams(); // <-- Get URL search params
  const activeMarkerId = searchParams.get("id"); // <-- Get marker ID from URL params

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      navigate(
        `?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
      );
    }
  }, [geolocationPosition, navigate]);

  // <-- New useEffect to open the popup when the marker ID is in the URL and all refs are set
  useEffect(() => {
    if (activeMarkerId && done) {
      const markerToOpen = markerRefs.current[activeMarkerId];
      if (markerToOpen) {
        markerToOpen.openPopup(); // <-- Open popup of the marker that matches the URL param
      }
    }
  }, [activeMarkerId, done]); // <-- Depend on `done` and URL param

  return (
    <>
      <MapCont>
        <StyledMapContainer
          center={mapPosition}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Array.isArray(recordings) &&
            recordings.map((recording, index) => (
              <Marker
                position={[recording.position.lat, recording.position.lng]}
                key={recording.id}
                icon={mapIcon}
                ref={(m) => {
                  // <-- Store marker reference
                  markerRefs.current[recording.id] = m; // <-- Add marker ref to the object
                  if (index === recordings.length - 1 && !done) {
                    setDone(true); // <-- Set done when all refs are set
                  }
                }}
                eventHandlers={{
                  click: () => {
                    navigate(
                      `explore/${recording.id}?id=${recording.id}&lat=${recording.position.lat}&lng=${recording.position.lng}`
                    );
                  },
                }}
              >
                <Popup>
                  <span>{recording.title}</span>
                </Popup>
              </Marker>
            ))}
          <ChangeLocation position={mapPosition} />
          <DetectClick />
        </StyledMapContainer>
      </MapCont>
      <Button onClick={getPosition} variant={"locate"}>
        {isLoadingPosition ? "Loading..." : "Get your position"}
      </Button>
    </>
  );
}

function ChangeLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
