import styled from "styled-components";

import NavBar from "../components/NavBar";
import { NavLink } from "react-router-dom";
import ForgotPasswordForm from "../features/authentication/ForgotPasswordForm";

const ForgotLayout = styled.main`
  min-height: 80vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  return (
    <>
      <NavBar />

      <ForgotLayout>
        <ForgotPasswordForm />
        <p>
          No account? Create one <NavLink to="/signup">here</NavLink>
        </p>
      </ForgotLayout>
    </>
  );
}

export default Login;
