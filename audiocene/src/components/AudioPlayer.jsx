import { useEffect, useState } from "react";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { getRecordingById } from "../services/apiRecordings";

function AudioPlayer() {
  const { currentRecordingId } = useCurrentlyPlaying();
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    if (currentRecordingId) {
      // Fetch the recording when the currentRecordingId changes
      getRecordingById(currentRecordingId).then((recording) => {
        setAudioSrc(recording);
      });
    }
  }, [currentRecordingId]);

  if (!audioSrc) return null; // Render nothing if no audio source

  return (
    <div>
      <p>Currently Playing:{audioSrc.title}</p>
      <audio controls autoPlay src={audioSrc.audio}></audio>
    </div>
  );
}

export default AudioPlayer;
