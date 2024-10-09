import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import supabase from "../../services/supabase";
import { useEffect } from "react";

export function useUser() {
  const queryClient = useQueryClient();

  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Invalidate the 'user' query to trigger a refetch
      queryClient.invalidateQueries(["user"]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
