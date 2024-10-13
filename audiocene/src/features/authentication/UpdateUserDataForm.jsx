import { useUser } from "./useUser";
import { useState } from "react";
import Button from "../../components/Button";

import FormRow from "../../components/FormRow";
import { useUpdateUser } from "./useUpdateUser";

export default function UpdateUserDataForm({ onProfileUpdate }) {
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
  }

  return (
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
        <input
          disabled={isUpdating}
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          // Should validate that it's actually an image
        />
      </FormRow>
      <FormRow>
        <Button onClick={handleCancel} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </form>
  );
}
