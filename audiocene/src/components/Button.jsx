/* eslint-disable react/prop-types */
import styled from "styled-components";

const ButtonBase = styled.button`
  background-color: var(--color-primary);
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: var(--color-bg);
  cursor: pointer;
  display: inline-block;
  font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
    source-sans-pro, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 0;
  /* outline: none; */
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  min-width: max-content;

  &:hover,
  &:focus {
    background-color: var(--color-primary-hover);
  }

  &:disabled {
    background-color: var(--color-dkgrey);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: var(--color-bg);
  color: var(--color-black);
  border: 2px solid var(--color-black);

  &:hover,
  &:focus {
    background-color: var(--color-bg);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }
`;

const TertiaryButton = styled(ButtonBase)`
  border: none;
  background-color: transparent;
  color: var(--color-primary);

  &:hover,
  &:focus {
    background-color: transparent;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const WarningButton = styled(ButtonBase)`
  background-color: var(--color-error-red);
  color: var(--color-bg);

  &:hover,
  &:focus {
    background-color: var(--color-error-hover);
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default function Button({ variant, children, onClick }) {
  let Component;
  switch (variant) {
    case "base":
      Component = ButtonBase;
      break;
    case "secondary":
      Component = SecondaryButton;
      break;
    case "tertiary":
      Component = TertiaryButton;
      break;
    case "warning":
      Component = WarningButton;
      break;
    default:
      Component = ButtonBase; // Default to ButtonBase if variant is unrecognized
      break;
  }

  return <Component onClick={onClick}>{children}</Component>;
}
