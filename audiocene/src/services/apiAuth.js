import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
  userID,
  password,
  fullName,
  avatar, // Avatar can be null or undefined
}) {
  // Step 1: Update password or fullName
  let updateData = {};
  if (password) updateData.password = password;
  if (fullName) updateData.data = { fullName };

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);

  // Step 2: Update profiles table with fullName only (if no avatar is passed)
  if (!avatar && fullName) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: fullName })
      .eq("id", userID);
    if (profileError) throw new Error(profileError.message);

    return data; // Return early if there's no avatar to handle
  }

  // Step 3: Upload avatar image only if provided
  let avatarUrl = null;
  if (avatar) {
    // Fetch the user's current avatar (if one exists)
    const { data: userProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("avatar_url") // Assuming `avatar_url` holds the file path to the user's current avatar
      .eq("id", userID)
      .single();

    if (fetchError) {
      console.error(fetchError);
      throw new Error("User profile not found");
    }

    //  Delete the previous avatar from storage if one exists
    if (userProfile.avatar_url) {
      const avatarDeleteUrl = userProfile.avatar_url.replace(
        "https://naiqpffpxlusflmdzeqa.supabase.co/storage/v1/object/public/avatars/",
        ""
      );
      const { error: deleteError } = await supabase.storage
        .from("avatars") // Replace with your bucket name
        .remove([avatarDeleteUrl]);

      if (deleteError) {
        console.error(deleteError);
        throw new Error("Failed to delete previous avatar");
      }
    }
    const fileName = `avatar-${data.user.id}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

    // Update the avatar URL in the user object
    const { data: updatedUser, error: avatarUpdateError } =
      await supabase.auth.updateUser({
        data: { avatar: avatarUrl },
      });

    if (avatarUpdateError) throw new Error(avatarUpdateError.message);
  }

  // Step 4: Update profiles table (with avatar or fullName if provided)
  const profileUpdateData = {};
  if (fullName) profileUpdateData.display_name = fullName;
  if (avatarUrl) profileUpdateData.avatar_url = avatarUrl;

  if (Object.keys(profileUpdateData).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdateData)
      .eq("id", data.user.id);

    if (profileError) throw new Error(profileError.message);
  }

  // Return the updated user object
  return data;
}

export async function checkIfUserExists(email, fullName) {
  const { data, error } = await supabase
    .from("profiles") // Adjust if your table is named differently
    .select("email_address, display_name")
    .or(`email_address.eq.${email},display_name.eq.${fullName}`); // Query both fields at once

  if (error) throw new Error(error.message);

  if (data.length === 0) return { emailExists: false, usernameExists: false };

  return {
    emailExists: data.some((user) => user.email_address === email),
    usernameExists: data.some((user) => user.display_name === fullName),
  };
}
