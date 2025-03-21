import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useState } from "react";
import styled from "styled-components";
import Heading from "../../components/Heading.jsx";
import { useLogin } from "./useLogin.js";
import { Link } from "react-router-dom";
import { QUERIES } from "../../constants";

const StyledLogin = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 3.2rem 4rem;
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 1rem;
  @media ${QUERIES.mobile} {
    max-width: 80%;
  }
`;

const FormContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  @media ${QUERIES.mobile} {
    font-size: 0.8rem;
  }
`;

export default function LoginForm() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("voyedo5540@arinuse.com");
  const [password, setPassword] = useState("qweqweqwe");

  const { login, isLoading } = useLogin();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <StyledLogin onSubmit={handleSubmit}>
      <Heading as="h4">Login to your account</Heading>

      <FormContent>
        <label htmlFor="email">Email address:</label>
        <input
          type="email"
          id="email"
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={isLoading}
        />
      </FormContent>

      <FormContent>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={isLoading}
        />
      </FormContent>

      <div>
        <Button disabled={isLoading}>Login</Button>
      </div>
      <Link to="/forgot-password">Forgot Password?</Link>
    </StyledLogin>
  );
}
