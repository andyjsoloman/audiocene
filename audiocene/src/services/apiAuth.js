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
  avatar,
}) {
  //1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar && fullName) {
    // Update profiles table with fullName only
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: fullName })
      .eq("id", userID);
    if (profileError) throw new Error(profileError.message);

    return data;
  }

  //2.Upload avatar image
  let avatarUrl = null;
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

  //3. Update avatar in user
  const { data: updatedUser, error: avatarUpdateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: avatarUrl,
      },
    });
  if (avatarUpdateError) throw new Error(avatarUpdateError.message);

  // 3. Update profiles table
  const profileUpdateData = {};
  if (fullName) profileUpdateData.display_name = fullName;
  if (avatarUrl) profileUpdateData.avatar_url = avatarUrl;

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdateData)
    .eq("id", data.user.id);

  if (profileError) throw new Error(profileError.message);
  return updatedUser;
}
