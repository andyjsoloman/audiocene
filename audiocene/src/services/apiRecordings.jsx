import supabase, { supabaseUrl } from "./supabase";

export async function getRecordings() {
  const { data, error } = await supabase.from("recordings").select("*");

  if (error) {
    console.error(error);
    throw new Error("Recordings could not be loaded");
  }

  return data;
}

export async function getRecordingById(id) {
  const { data, error } = await supabase
    .from("recordings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Recording could not be loaded");
  }

  return data;
}

export async function createRecording(newRecording) {
  console.log("creating");
  const audioName = `${Math.random()}-${newRecording.audio.name}`.replaceAll(
    "/",
    ""
  );

  const audioPath = `${supabaseUrl}/storage/v1/object/public/recordings-audio/${audioName}`;

  // 1. Create Recording
  const { data, error } = await supabase
    .from("recordings")
    .insert([{ ...newRecording, audio: audioPath }])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Recording could not be created");
  }

  // 2. Upload Audio
  const { error: storageError } = await supabase.storage
    .from("recordings-audio")
    .upload(audioName, newRecording.audio);

  // 3. Delete the recording IF there was an error uploading audio
  if (storageError) {
    await supabase.from("recordings").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error("Problem with uploading audio");
  }
}

export async function deleteRecording(id) {
  const { error } = await supabase.from("recordings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Recording could not be deleted");
  }
}
