import { useForm } from "react-hook-form";

import styled from "styled-components";
import Button from "../../components/Button";
import FormRow from "../../components/FormRow";

// Email regex: /\S+@\S+\.\S+/

const StyledSignup = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.2rem 4rem;
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 1rem;
`;

function SignupForm() {
  return (
    <StyledSignup>
      <FormRow label="Full name" error={""}>
        <input type="text" id="fullName" />
      </FormRow>

      <FormRow label="Email address" error={""}>
        <input type="email" id="email" />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={""}>
        <input type="password" id="password" />
      </FormRow>

      <FormRow label="Repeat password" error={""}>
        <input type="password" id="passwordConfirm" />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button>Cancel</Button>
        <Button>Create new user</Button>
      </FormRow>
    </StyledSignup>
  );
}

export default SignupForm;
