import { useUser } from "./useUser";
import { useState } from "react";
import Button from "../../components/Button";
import FormRow from "../../components/FormRow";
import { useUpdateUser } from "./useUpdateUser";
import styled from "styled-components";
import FileInput from "../../components/FileInput";

const FormContainer = styled.div`
  margin: 80px 120px;
`;

const Input = styled.input`
  &::file-selector-button {
    /* background-color: var(--color-primary);
    
    border-style: none;
    box-sizing: border-box;
    color: var(--color-bg); */

    cursor: pointer;
    display: inline-block;
    font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans",
      source-sans-pro, sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    line-height: 20px;
    list-style: none;
    margin-right: 12px;
    /* outline: none; */
    padding: 10px 16px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: color 100ms;
    vertical-align: baseline;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    min-width: max-content;
  }
`;

export default function UpdateUserDataForm({
  onProfileUpdate,
  setEditingProfile,
}) {
  // We don't need the loading state
  const user = useUser();
  const {
    id: userID,
    email,
    user_metadata: { fullName: currentFullName } = {},
  } = user.user;

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  const { updateUser, isLoading: isUpdating } = useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;

    updateUser(
      { fullName, avatar, userID },
      {
        onSuccess: () => {
          setAvatar(null);
          // Resetting form using .reset() that's available on all HTML form elements, otherwise the old filename will stay displayed in the UI
          e.target.reset();

          if (onProfileUpdate) onProfileUpdate();
        },
      }
    );
  }

  function handleCancel(e) {
    // We don't even need preventDefault because this button was designed to reset the form (remember, it has the HTML attribute 'reset')
    setFullName(currentFullName);
    setAvatar(null);
    setEditingProfile(false);
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormRow label="Email address">
          <input value={email} disabled />
        </FormRow>
        <FormRow label="Username">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isUpdating}
            id="fullName"
          />
        </FormRow>
        <FormRow label="Avatar image">
          <FileInput
            disabled={isUpdating}
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            // Should validate that it's actually an image
          />
        </FormRow>
        <FormRow>
          <Button onClick={handleCancel} type="reset" variant="secondary">
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update account</Button>
        </FormRow>
      </form>
    </FormContainer>
  );
}
