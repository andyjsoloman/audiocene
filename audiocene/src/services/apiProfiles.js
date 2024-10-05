import supabase from "./supabase";

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Error fetching profile:");
  }
  return data;
}

export async function getProfilesByIds(ids) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids); // Use .in() to fetch multiple profiles

  if (error) {
    console.error("Error fetching profiles:", error);
    throw new Error("Error fetching profiles:");
  }
  return data;
}
