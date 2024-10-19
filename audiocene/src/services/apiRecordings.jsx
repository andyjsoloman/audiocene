import supabase, { supabaseUrl } from "./supabase";

export async function getRecordings() {
  const { data, error } = await supabase.from("recordings").select("*");

  if (error) {
    console.error(error);
    throw new Error("Recordings could not be loaded");
  }

  return data;
}

export async function getRecordingsByUserId(userId) {
  const { data, error } = await supabase
    .from("recordings")
    .select("*")
    .eq("user_id", userId);

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

export async function createEditRecording(newRecording, id, userId) {
  const hasAudioPath = newRecording.audio?.startsWith?.(supabaseUrl);

  const audioName = `${Math.random()}-${newRecording.audio.name}`.replaceAll(
    "/",
    ""
  );

  const audioPath = hasAudioPath
    ? newRecording.audio
    : `${supabaseUrl}/storage/v1/object/public/recordings-audio/${audioName}`;

  // 1. Create / Edit Recording
  let query = supabase.from("recordings");

  // A) CREATE
  if (!id) {
    query = query.insert([{ ...newRecording, audio: audioPath }]);
  }

  // B) EDIT
  if (id) {
    // Fetch the recording to check its owner
    const { data: existingRecording, error: fetchError } = await supabase
      .from("recordings")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      throw new Error("Error fetching the recording");
    }

    console.log(`Existing recording user ID: ${existingRecording.user_id}`);
    console.log(`Current user ID: ${userId}`);

    // Check if the current user is the owner
    if (existingRecording.user_id !== userId) {
      throw new Error("You are not authorized to edit this recording");
    }

    query = query.update({ ...newRecording, audio: audioPath }).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Recording could not be created/edited");
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

export async function deleteRecording(id, currentUserId) {
  // Step 1: Retrieve the recording to verify the owner
  const { data: recording, error: fetchError } = await supabase
    .from("recordings")
    .select("user_id, audio")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Recording not found or could not be fetched");
  }

  // Step 2: Check if the current user is the owner of the recording
  if (recording.user_id !== currentUserId) {
    throw new Error("You are not authorized to delete this recording");
  }
  const recordingUrl = recording.audio.replace(
    "https://naiqpffpxlusflmdzeqa.supabase.co/storage/v1/object/public/recordings-audio/",
    ""
  );

  // Step 3: Delete the file from Supabase storage
  const { error: deleteStorageError } = await supabase.storage
    .from("recordings-audio")
    .remove([recordingUrl]);

  if (deleteStorageError) {
    console.error(deleteStorageError);
    throw new Error("File could not be deleted from storage");
  }

  // Step 4: Proceed with deletion if user is authorized
  const { error: deleteError } = await supabase
    .from("recordings")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Recording could not be deleted");
  }
}
