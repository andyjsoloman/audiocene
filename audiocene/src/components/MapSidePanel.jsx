import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";
import { QUERIES } from "../constants";

const OuterContainer = styled.div`
  position: absolute;
  z-index: 500;
  width: 500px;
  height: 500px;
  right: 100px;

  border: 1px solid var(--color-black);
  border-radius: 12px;
  overflow: hidden;

  @media ${QUERIES.tablet} {
    width: 90%;
    height: 30%;

    left: 5%;
    bottom: 140px;
  }
`;

const PanelContainer = styled.div`
  background-color: var(--color-bg);
  height: 100%;
  padding: 20px;
  overflow: scroll;
  overflow-x: hidden;
`;

function MapSidePanel() {
  return (
    <OuterContainer>
      <PanelContainer>
        <AppNav />

        <Outlet />
      </PanelContainer>
    </OuterContainer>
  );
}

export default MapSidePanel;
