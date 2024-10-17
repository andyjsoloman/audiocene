import { createPortal } from "react-dom";
import styled from "styled-components";
import CloseIcon from "./CloseIcon";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-bg);
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 40px;
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

const CloseButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return children(() => open(opensWindowName));
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <CloseButton onClick={close}>
          <CloseIcon />
        </CloseButton>

        <Content>{children({ onCloseModal: close })}</Content>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
