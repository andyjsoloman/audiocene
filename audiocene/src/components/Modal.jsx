import styled from "styled-components";
import Button from "./Button";
import CloseIcon from "./CloseIcon";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-bg);
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

function Modal({ children, onClose }) {
  return (
    <Overlay>
      <StyledModal>
        <Button variant="tertiary" onClick={onClose}>
          <CloseIcon />
        </Button>

        <div>{children}</div>
      </StyledModal>
    </Overlay>
  );
}

export default Modal;
