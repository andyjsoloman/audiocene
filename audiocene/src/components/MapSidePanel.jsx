import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";

const PanelContainer = styled.div`
  flex-basis: 600px;
`;

function MapSidePanel() {
  return (
    <PanelContainer>
      <h1>AUDIOCENE APP</h1>
      <AppNav />

      <Outlet />
    </PanelContainer>
  );
}

export default MapSidePanel;
