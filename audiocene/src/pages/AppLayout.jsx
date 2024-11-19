import AudioPlayer from "../components/AudioPlayer";

import MapGL from "../components/MapGL";
import MapSidePanel from "../components/MapSidePanel";
import NavBar from "../components/NavBar";

import styled from "styled-components";
import { QUERIES } from "../constants";

const AppContainer = styled.div`
  padding: 20px 40px 20px 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media ${QUERIES.tablet} {
    padding: 20px 12px 12px 12px;
  }
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
