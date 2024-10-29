import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";

const PanelContainer = styled.div`
  position: absolute;

  right: 100px;

  z-index: 500;
  width: 500px;
  height: 500px;
  background-color: var(--color-bg);
  border: 1px solid var(--color-black);
  border-radius: 12px;
  padding: 20px;
  overflow: scroll;
`;

function MapSidePanel() {
  return (
    <PanelContainer>
      <AppNav />

      <Outlet />
    </PanelContainer>
  );
}

export default MapSidePanel;
