import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import FormRow from "../../components/FormRow";
import { useUpdateUser } from "./useUpdateUser";
import styled from "styled-components";

const FormContainer = styled.div`
  margin: 80px 120px;
`;

function UpdatePasswordForm({ setEditingPassword }) {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updateUser, isLoading: isUpdating } = useUpdateUser();

  function onSubmit({ password }) {
    updateUser({ password }, { onSuccess: () => reset() });
  }

  function handleReset(e) {
    e.preventDefault();
    reset();
    setEditingPassword(false);
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label="Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <input
            type="password"
            id="password"
            // this makes the form better for password managers
            autoComplete="current-password"
            disabled={isUpdating}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </FormRow>

        <FormRow
          label="Confirm password"
          error={errors?.passwordConfirm?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            id="passwordConfirm"
            disabled={isUpdating}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                getValues().password === value || "Passwords need to match",
            })}
          />
        </FormRow>
        <FormRow>
          <Button onClick={handleReset} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update password</Button>
        </FormRow>
      </form>
    </FormContainer>
  );
}

export default UpdatePasswordForm;
