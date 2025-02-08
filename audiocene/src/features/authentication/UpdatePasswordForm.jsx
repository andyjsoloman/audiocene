import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import supabase from "../../services/supabase.js";
import Button from "../../components/Button";
import FormRow from "../../components/FormRow";
import styled from "styled-components";

const FormContainer = styled.div`
  margin: 80px 120px;
`;

function ResetPasswordPage() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit({ password }) {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      console.error(error);
      return;
    }
    alert("Password successfully reset!");
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="New Password" error={errors?.password?.message}>
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
        </FormRow>

        <FormRow
          label="Confirm Password"
          error={errors?.passwordConfirm?.message}
        >
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
        </FormRow>

        <FormRow>
          <Button disabled={isSubmitting}>Reset Password</Button>
        </FormRow>
      </form>
    </FormContainer>
  );
}

export default ResetPasswordPage;
