import styled from "styled-components";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-bg);
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 3.2rem 4 rem;
  transition: all 0.5s;
`;

function Modal() {
  return <div></div>;
}

export default Modal;
