import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditRecording } from "../../services/apiRecordings";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";

export function useEditRecording() {
  const queryClient = useQueryClient();

  const { mutate: editRecording, isPending: isEditing } = useMutation({
    mutationFn: async ({ newRecordingData, id }) => {
      // Fetch the current authenticated user from Supabase
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error("Unable to retrieve user. Please log in.");
      }

      // Passing the user's ID along with the recording data
      return createEditRecording(newRecordingData, id, user.id);
    },
    onSuccess: () => {
      toast.success("Recording successfully edited");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editRecording };
}
