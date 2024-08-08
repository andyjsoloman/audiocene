import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditRecording } from "../../services/apiRecordings";
import toast from "react-hot-toast";

export function useEditRecording() {
  const queryClient = useQueryClient();
  const { mutate: editRecording, isLoading: isEditing } = useMutation({
    mutationFn: ({ newRecordingData, id }) =>
      createEditRecording(newRecordingData, id),
    onSuccess: () => {
      toast.success("Recording successfully edited");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editRecording };
}
