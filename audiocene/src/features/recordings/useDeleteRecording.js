import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecording as deleteRecordingApi } from "../../services/apiRecordings";
import toast from "react-hot-toast";

export function useDeleteRecording() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteRecording } = useMutation({
    mutationFn: deleteRecordingApi,

    onSuccess: () => {
      toast.success("Recording deleted");
      queryClient.invalidateQueries({
        queryKey: ["recordings"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteRecording };
}
