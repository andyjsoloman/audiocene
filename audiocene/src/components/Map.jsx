import {
  MapContainer as BaseMapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useRecordings } from "../contexts/RecordingsContext";
import MapSidePanel from "./MapSidePanel";
import { useState, useEffect } from "react";

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
  iconUrl: "../public/mapMarker.svg",
  iconSize: [45, 60],
  iconAnchor: [22, 60],
  popupAnchor: [5, -40],
  //   shadowUrl: "my-icon-shadow.png",
  //   shadowSize: [68, 95],
  //   shadowAnchor: [22, 94],
});

function Map() {
  const navigate = useNavigate();
  const { recordings } = useRecordings();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  const [searchParams, setSearchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  return (
    <MapCont>
      <StyledMapContainer center={mapPosition} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {recordings.map((recording) => (
          <Marker
            position={[recording.position.lat, recording.position.lng]}
            key={recording.id}
            icon={mapIcon}
          >
            <Popup>
              <span>{recording.title}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeLocation position={mapPosition} />
      </StyledMapContainer>
    </MapCont>
  );
}

function ChangeLocation({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

export default Map;
