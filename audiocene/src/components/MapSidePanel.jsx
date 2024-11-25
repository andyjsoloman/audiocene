import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AppNav from "./AppNav";
import { QUERIES } from "../constants";
import { useState } from "react";

const OuterContainer = styled.div`
  position: absolute;
  z-index: 500;
  width: 500px;
  height: 500px;
  right: 100px;

  border: 1px solid var(--color-black);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  min-height: ${(props) => (props.$isOpen ? "600px" : "200px")};
  transition: min-height 0.3s ease-in-out;

  @media ${QUERIES.tablet} {
    width: calc(100% - 24px);
    height: 30%;
    left: 12px;
    bottom: 2rem;
  }
`;

const ToggleButton = styled.button`
  width: 80px;
  border-style: none;
  height: 6px;
  border-radius: 3px;
  background-color: var(--color-mdgrey);
`;

const ToggleContainer = styled.div`
  flex-direction: column;

  align-items: center;
  padding-bottom: 40px;
  display: none;
  @media ${QUERIES.tablet} {
    display: flex;
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <OuterContainer $isOpen={isOpen}>
      <PanelContainer>
        <ToggleContainer>
          <ToggleButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close panel" : "Open panel"}
          />
        </ToggleContainer>

        <AppNav />

        <Outlet />
      </PanelContainer>
    </OuterContainer>
  );
}

export default MapSidePanel;
