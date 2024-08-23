import AudioPlayer from "../components/AudioPlayer";
import Map from "../components/Map";
import MapSidePanel from "../components/MapSidePanel";
import NavBar from "../components/NavBar";

import styled from "styled-components";

const AppContainer = styled.div`
  padding: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

function AppLayout() {
  return (
    <>
      <NavBar />
      <AppContainer>
        <Map />
        <MapSidePanel />
      </AppContainer>
      <AudioPlayer />
    </>
  );
}

export default AppLayout;
