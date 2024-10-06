import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecording as deleteRecordingApi } from "../../services/apiRecordings";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";

export function useDeleteRecording() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteRecording } = useMutation({
    mutationFn: async ({ id }) => {
      // Ensure id is provided
      if (!id) throw new Error("Recording ID is required.");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error("Unable to retrieve user. Please log in.");
      }

      return deleteRecordingApi(id, user.id);
    },

    onSuccess: () => {
      toast.success("Recording deleted");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteRecording };
}
