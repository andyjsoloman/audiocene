import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import NavBar from "../components/NavBar";
import SignupForm from "../features/authentication/SignupForm";

const LoginLayout = styled.main`
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

      <LoginLayout>
        <SignupForm />
      </LoginLayout>
    </>
  );
}

export default Login;
