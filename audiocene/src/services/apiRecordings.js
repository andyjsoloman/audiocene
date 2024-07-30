import supabase from "./supabase";

export async function getRecordings() {
  const { data, error } = await supabase.from("recordings").select("*");

  if (error) {
    console.error(error);
    throw new Error("Recordings could not be loaded");
  }

  return data;
}

export async function createRecording(newRecording) {
  const { data, error } = await supabase
    .from("recordings")
    .insert([newRecording])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Recording could not be created");
  }
}

export async function deleteRecording(id) {
  const { error } = await supabase.from("recordings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Recording could not be deleted");
  }
}
