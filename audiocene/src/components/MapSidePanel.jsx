import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";

const PanelContainer = styled.div`
  position: absolute;

  right: 100px;
  z-index: 500;
  width: 500px;
  height: 400px;
  background-color: white;
  border: 1px solid var(--color-black);
  border-radius: 12px;
  padding: 20px;
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
