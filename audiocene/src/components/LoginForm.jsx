import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "./Heading.jsx";

const StyledLogin = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.2rem 4rem;
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 1rem;
`;

export default function LoginForm() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <StyledLogin onSubmit={handleSubmit}>
      <Heading as="h4">Login to your account</Heading>
      <div>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div>
        <Button>Login</Button>
      </div>
    </StyledLogin>
  );
}
