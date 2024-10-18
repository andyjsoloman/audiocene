import supabase from "./supabase";

export async function getFavoriteByUserIdAndRecordingId(userId, recordingId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("recording_id", recordingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Favorite could not be loaded");
  }

  return data;
}

export async function getFavoritesByUserId(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Favorites could not be loaded");
  }

  return data;
}
