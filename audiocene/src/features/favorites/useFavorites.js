import { useQuery } from "@tanstack/react-query";
import {
  getFavoriteByIds,
  getFavoritesByUserId,
} from "../../services/apiFavorites";

// Hook to get a specific favorite by userId and recordingId
export function useFavoriteByIds(userId, recordingId) {
  const {
    isLoading,
    data: favorite,
    error,
  } = useQuery({
    queryKey: ["favorite", userId, recordingId], // Caching based on both userId and recordingId
    queryFn: () => getFavoriteByIds(userId, recordingId), // Fetch function
    enabled: Boolean(userId && recordingId), // Only fetch if both userId and recordingId are present
  });

  return { isLoading, error, favorite };
}

// Hook to get all favorites by userId
export function useFavoritesByUserId(userId) {
  const {
    isLoading,
    data: favorites,
    error,
  } = useQuery({
    queryKey: ["favorites", userId], // Caching based on userId
    queryFn: () => getFavoritesByUserId(userId), // Fetch function
    enabled: Boolean(userId), // Only fetch if userId is present
  });

  return { isLoading, error, favorites };
}
