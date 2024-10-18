import { useQuery } from "@tanstack/react-query";
import {
  getRecordings,
  getRecordingById,
  getRecordingsByUserId,
} from "../../services/apiRecordings";
import { getProfileById } from "../../services/apiProfiles";

export function useRecordings(userId, recordingId) {
  // Fetch recordings by user ID, or all recordings if no userId is provided
  const {
    isLoading: loadingRecordings,
    data: recordings,
    error: recordingsError,
  } = useQuery({
    queryKey: ["recordings", userId],
    queryFn: userId ? () => getRecordingsByUserId(userId) : getRecordings,
  });

  // Fetch a specific recording if recordingId is provided
  const {
    isLoading: loadingRecording,
    data: recording,
    error: recordingError,
  } = useQuery({
    queryKey: ["recording", recordingId],
    queryFn: () => (recordingId ? getRecordingById(recordingId) : null),
    enabled: !!recordingId, // Only run if recordingId exists
  });

  // Fetch user profile for the recording's user
  const {
    data: user,
    error: userError,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user", recording?.user_id],
    queryFn: () => {
      if (recording && recording.user_id) {
        return getProfileById(recording.user_id); // Fetch profile for the user
      }
      return null; // Prevent fetching if recording or user_id is not available
    },
    enabled: !!recording && !!recording.user_id,
  });

  return {
    loadingRecordings,
    recordings,
    recordingsError,
    loadingRecording,
    recording,
    recordingError,
    loadingUser,
    user,
    userError,
  };
}
