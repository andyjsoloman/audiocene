import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "../../../services/apiProfiles";

export function useProfile(userId) {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileById(userId),
    enabled: !!userId,
  });

  return {
    profile,
    isLoading,
    error,
  };
}
