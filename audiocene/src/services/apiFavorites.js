import supabase from "./supabase";

export async function getFavoriteByIds(userId, recordingId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("recording_id", recordingId)
    .maybeSingle();

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

export async function createFavorite({ userId, recordingId }) {
  const { data, error } = await supabase
    .from("favorites")
    .insert([
      {
        user_id: userId,
        recording_id: recordingId,
      },
    ])
    .single();

  if (error) {
    console.error(error);
    throw new Error("Favorite could not be created");
  }

  return data;
}

export async function deleteFavorite({ userId, recordingId }) {
  const { error: deleteError } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("recording_id", recordingId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Favourite could not be deleted");
  }
}
