import React from "react";
import styled from "styled-components";

const Input = styled.input`
  &::file-selector-button {
    /* background-color: var(--color-primary);
    
    border-style: none;
    box-sizing: border-box;
    color: var(--color-bg); */
    border-radius: 6px;
    border: 0.5px solid var(--color-dkgrey);
    cursor: pointer;
    display: inline-block;
    font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
      source-sans-pro, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    line-height: 20px;
    list-style: none;
    margin-right: 12px;
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
      color: var(--color-primary);
    }
  }
`;

const FileInput = React.forwardRef((props, ref) => {
  return <Input ref={ref} {...props} />;
});

FileInput.displayName = "FileInput";

export default FileInput;
