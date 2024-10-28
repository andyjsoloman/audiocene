import { createPortal } from "react-dom";
import styled from "styled-components";
import CloseIcon from "./CloseIcon";
import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    if (name === openName && ref.current) {
      // Focus on the modal when it opens
      ref.current.focus();

      // Function to trap focus within the modal
      const handleTabKey = (e) => {
        const focusableElements = ref.current.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === "Tab") {
          if (e.shiftKey) {
            // Shift + Tab: focus the last element if we're on the first one
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab: focus the first element if we're on the last one
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      // Handle ESC key to close modal
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          close();
        } else {
          handleTabKey(e);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener when modal is closed
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [name, openName, close, ref]);

  if (name !== openName) return null;

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref} tabIndex={-1} aria-modal="true" role="dialog">
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
