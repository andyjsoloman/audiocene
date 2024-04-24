import Map from "../components/Map";
import NavBar from "../components/NavBar";
import MapSidePanel from "../components/MapSidePanel";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 40px;
`;

function AppLayout() {
  return (
    <>
      <NavBar />
      <AppContainer>
        <MapSidePanel />
        <Map />
      </AppContainer>
    </>
  );
}

export default AppLayout;
