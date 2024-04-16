import {
  MapContainer as BaseMapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import styled from "styled-components";

const StyledMapContainer = styled(BaseMapContainer)`
  height: 100%;
  width: 100%; // Ensuring it takes up all the available width too
`;

const MapCont = styled.div`
  height: 700px;
  width: 50%;
`;

function Map() {
  return (
    <MapCont>
      <StyledMapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </StyledMapContainer>
    </MapCont>
  );
}

export default Map;
