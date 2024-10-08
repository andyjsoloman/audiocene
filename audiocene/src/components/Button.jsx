/* eslint-disable react/prop-types */
import styled from "styled-components";

const ButtonBase = styled.button`
  background-color: var(--color-primary);
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
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

  &:hover,
  &:focus {
    background-color: var(--color-primary-hover);
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

export default function Button({ variant, children, onClick }) {
  let Component;
  switch (variant) {
    case "base":
      Component = ButtonBase;
      break;
    case "secondary":
      Component = SecondaryButton;
      break;
    default:
      Component = ButtonBase; // Default to ButtonBase if variant is unrecognized
      break;
  }

  return <Component onClick={onClick}>{children}</Component>;
}
