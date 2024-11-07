import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditRecording } from "../../services/apiRecordings";

export function useCreateRecording() {
  const queryClient = useQueryClient();

  const { mutate: createRecording, isPending: isCreating } = useMutation({
    mutationFn: createEditRecording,
    onSuccess: () => {
      toast.success("New recording created");
      queryClient.invalidateQueries({ queryKey: ["recordings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createRecording };
}
