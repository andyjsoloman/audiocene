import styled from "styled-components";
import Button from "./Button";
import { QUERIES } from "../constants";

const GeolocateContainer = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 4rem;
  left: 25%;
  color: var(--color-black);

  @media ${QUERIES.tablet} {
    display: none;
  }
`;
const LocateButton = styled.button`
  padding: 4px;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  cursor: pointer;
  background-color: var(--color-bg);
  color: var(--color-black);
  border: 2px solid var(--color-black);
  position: absolute;
  z-index: 1000;
  top: 8rem;
  right: 3rem;
  display: none;

  @media ${QUERIES.tablet} {
    display: revert;
  }
  @media ${QUERIES.mobile} {
    top: 7rem;
  }
`;

const LocateIcon = styled.svg`
  width: 32px;
  height: 32px;
  fill: currentColor;
`;

function GeoLocateButton({ getYourPosition, isLoadingPosition }) {
  return (
    <>
      <GeolocateContainer>
        <Button onClick={getYourPosition} variant={"secondary"}>
          {isLoadingPosition ? "Loading..." : "Get your position"}
        </Button>
      </GeolocateContainer>
      <LocateButton onClick={getYourPosition}>
        <LocateIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <path d="M240,120H215.63A88.13,88.13,0,0,0,136,40.37V16a8,8,0,0,0-16,0V40.37A88.13,88.13,0,0,0,40.37,120H16a8,8,0,0,0,0,16H40.37A88.13,88.13,0,0,0,120,215.63V240a8,8,0,0,0,16,0V215.63A88.13,88.13,0,0,0,215.63,136H240a8,8,0,0,0,0-16ZM128,200a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Zm0-112a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"></path>
        </LocateIcon>
      </LocateButton>
    </>
  );
}

export default GeoLocateButton;
