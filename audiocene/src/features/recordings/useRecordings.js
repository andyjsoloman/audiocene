import { useQuery } from "@tanstack/react-query";
import { getRecordings } from "../../services/apiRecordings";

export function useRecordings() {
  const {
    isLoading,
    data: recordings,
    error,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: getRecordings,
  });

  return { isLoading, error, recordings };
}
