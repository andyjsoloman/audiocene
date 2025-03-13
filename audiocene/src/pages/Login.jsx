import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import NavBar from "../components/NavBar";
import { NavLink } from "react-router-dom";
import { QUERIES } from "../constants";

const LoginLayout = styled.main`
  min-height: 80vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
  @media ${QUERIES.mobile} {
    display: flex;
    flex-direction: column;
    margin: auto;
    align-items: center;
  }
`;

function Login() {
  return (
    <>
      <NavBar />

      <LoginLayout>
        <LoginForm />
        <p>
          No account? Create one <NavLink to="/signup">here</NavLink>
        </p>
      </LoginLayout>
    </>
  );
}

export default Login;
