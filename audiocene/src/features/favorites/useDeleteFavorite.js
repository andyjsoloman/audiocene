import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite as deleteFavoriteApi } from "../../services/apiFavorites";
import toast from "react-hot-toast";

export function useDeleteFavorite() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteFavorite } = useMutation({
    mutationFn: async ({ userId, recordingId }) => {
      if (!userId) throw new Error("Recording ID is required.");

      return deleteFavoriteApi({ userId, recordingId });
    },

    onSuccess: () => {
      toast.success("Favourite Removed");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteFavorite };
}
