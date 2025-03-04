import styled from "styled-components";

const ErrorMessage = styled.p`
  color: var(--color-error-red);
  font-size: 12px;
`;

function Error({ children }) {
  return <ErrorMessage>{children}</ErrorMessage>;
}

export default Error;
