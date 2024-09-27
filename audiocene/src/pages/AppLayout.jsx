import AudioPlayer from "../components/AudioPlayer";
import Map from "../components/Map";
import MapGL from "../components/MapGL";
import MapSidePanel from "../components/MapSidePanel";
import NavBar from "../components/NavBar";

import styled from "styled-components";

const AppContainer = styled.div`
  padding: 40px 40px 20px 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: -20px;
  display: flex;
  justify-content: flex-end;
`;

function AppLayout() {
  return (
    <>
      <NavBar />
      <AppContainer>
        {/* <Map /> */}
        <MapGL />
        <MapSidePanel />
      </AppContainer>
      <Footer>
        <AudioPlayer />
      </Footer>
    </>
  );
}

export default AppLayout;
