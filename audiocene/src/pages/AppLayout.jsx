import Map from "../components/Map";
import NavBar from "../components/NavBar";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  /* justify-content: space-evenly; */
`;

function AppLayout() {
  return (
    <>
      <NavBar />
      <AppContainer>
        <h1>AUDIOCENE APP</h1>
        <Map />
      </AppContainer>
    </>
  );
}

export default AppLayout;
