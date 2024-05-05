/* eslint-disable react/prop-types */
import styled from "styled-components";

const BaseMessage = styled.p`
  text-align: center;
  font-size: 1.8rem;
  width: 80%;
  margin: 2rem auto;
  font-weight: 600;
`;

export default function Message({ message }) {
  return <BaseMessage> {message}</BaseMessage>;
}
