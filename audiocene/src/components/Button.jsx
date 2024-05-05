/* eslint-disable react/prop-types */
import styled from "styled-components";

const ButtonBase = styled.button`
  cursor: pointer;
  font-size: 18px;
  background-color: var(--color-primary);
  color: #fff;

  &:hover {
    background-color: var(--color-primary-hover);
    transition-duration: 0.35s;
  }
`;

const GeoLocateButton = styled(ButtonBase)`
  background-color: #000;
  position: absolute;
  z-index: 1000;

  bottom: 4rem;
  left: 30%;
`;

export default function Button({ variant, children, onClick }) {
  let Component;
  switch (variant) {
    case "base":
      Component = ButtonBase;
      break;
    case "locate":
      Component = GeoLocateButton;
      break;
    default:
      Component = ButtonBase; // Default to ButtonBase if variant is unrecognized
      break;
  }

  return <Component onClick={onClick}>{children}</Component>;
}
