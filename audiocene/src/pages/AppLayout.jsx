import { useEffect } from "react";
import Map from "../components/Map";
import MapSidePanel from "../components/MapSidePanel";
import NavBar from "../components/NavBar";

import styled from "styled-components";
import { getRecordings } from "../services/apiRecordings";

const AppContainer = styled.div`
  padding: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

function AppLayout() {
  useEffect(function () {
    getRecordings().then((data) => console.log(data));
  }, []);

  return (
    <>
      <NavBar />
      <AppContainer>
        <Map />
        <MapSidePanel />
      </AppContainer>
    </>
  );
}

export default AppLayout;
