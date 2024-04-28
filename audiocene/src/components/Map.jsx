import {
  MapContainer as BaseMapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useRecordings } from "../contexts/RecordingsContext";

const StyledMapContainer = styled(BaseMapContainer)`
  height: 100%;
  width: 100%; // Ensuring it takes up all the available width too
`;

const MapCont = styled.div`
  height: 600px;
  width: 40%;
  flex: 1;
`;

const mapIcon = L.icon({
  iconUrl: "../src/assets/mapmarker.png",
  iconSize: [36, 50],
  iconAnchor: [18, 50],
  popupAnchor: [5, -40],
  //   shadowUrl: "my-icon-shadow.png",
  //   shadowSize: [68, 95],
  //   shadowAnchor: [22, 94],
});

function Map() {
  const { recordings } = useRecordings();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <MapCont>
      <StyledMapContainer center={[51, -1.8]} zoom={13} scrollWheelZoom={true}>
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
      </StyledMapContainer>
    </MapCont>
  );
}

export default Map;
