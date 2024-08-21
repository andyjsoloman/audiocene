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

import { useState, useEffect } from "react";
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

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
        navigate(
          `?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
        );
      }
    },
    [geolocationPosition]
  );

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
            recordings.map((recording) => (
              <Marker
                position={[recording.position.lat, recording.position.lng]}
                key={recording.id}
                icon={mapIcon}
                eventHandlers={{
                  click: () => {
                    navigate(
                      `favourites/${recording.id}?lat=${recording.position.lat}&lng=${recording.position.lng}`
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
        {isLoadingPosition ? "Loading..." : "Get your position"}{" "}
      </Button>
    </>
  );
}

function ChangeLocation({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
