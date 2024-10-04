import supabase from "./supabase";

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("auth.users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return data;
  }
}
