import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loggedOut, setLoggedOut] = useState(false);

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      setLoggedOut(true);
      navigate("/app/explore", { replace: true });
    },
  });

  return { logout, isLoading, loggedOut };
}
