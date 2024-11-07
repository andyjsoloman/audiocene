import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFavorite } from "../../services/apiFavorites";

export function useCreateFavorite() {
  const queryClient = useQueryClient();

  const { mutate: addFavorite, isPending: isAdding } = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      toast.success("Saved to favourites");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isAdding, addFavorite };
}
