import { useQuery } from "@tanstack/react-query";
import {
  getRecordings,
  getRecordingsByUserId,
} from "../../services/apiRecordings";

export function useRecordings(userId) {
  // If userId is provided, fetch recordings by user ID, else fetch all recordings
  const {
    isLoading,
    data: recordings,
    error,
  } = useQuery({
    queryKey: ["recordings", userId], // Update the queryKey to handle caching for different userId values
    queryFn: userId ? () => getRecordingsByUserId(userId) : getRecordings, // Use the appropriate function based on userId
  });

  return { isLoading, error, recordings };
}
