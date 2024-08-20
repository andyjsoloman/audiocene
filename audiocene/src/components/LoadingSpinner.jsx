import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const SpinnerContainer = styled.div`
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: conic-gradient(#0000 10%, var(--color-primary));
  mask: radial-gradient(
    farthest-side,
    rgba(0, 0, 0, 0) calc(100% - 8px),
    black 0
  );
  animation: ${rotate} 1.5s infinite linear;
`;

export default function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
}
