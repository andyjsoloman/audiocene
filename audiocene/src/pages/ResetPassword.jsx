import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Heading from "../components/Heading";
import supabase from "../services/supabase";

const StyledResetPassword = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.2rem 4rem;
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 1rem;
`;

export default function ResetPassword() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit({ password }) {
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Your password has been successfully reset.");
      reset();
    }

    setIsSubmitting(false);
  }

  return (
    <StyledResetPassword onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h4">Reset Your Password</Heading>

      <label htmlFor="password">New Password:</label>
      <input
        type="password"
        id="password"
        autoComplete="new-password"
        disabled={isSubmitting}
        {...register("password", {
          required: "This field is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <label htmlFor="passwordConfirm">Confirm Password:</label>
      <input
        type="password"
        id="passwordConfirm"
        autoComplete="new-password"
        disabled={isSubmitting}
        {...register("passwordConfirm", {
          required: "This field is required",
          validate: (value) =>
            getValues().password === value || "Passwords must match",
        })}
      />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}

      <Button disabled={isSubmitting}>Reset Password</Button>
      {message && (
        <div>
          <p>{message}</p>
          {!errors.password &&
            !errors.passwordConfirm &&
            message.includes("successfully") && (
              <Link to="/login">Back to Login</Link>
            )}
        </div>
      )}
    </StyledResetPassword>
  );
}
