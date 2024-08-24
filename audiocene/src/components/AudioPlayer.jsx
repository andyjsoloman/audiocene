import { useEffect, useState, useRef } from "react";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { getRecordingById } from "../services/apiRecordings";
import styled from "styled-components";
import PlayButton from "./PlayButton";

function AudioPlayer() {
  const { currentRecordingId } = useCurrentlyPlaying();
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    // Ensure audio element exists before adding listeners
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioSrc]); // Add `audioSrc` to dependencies to re-run effect when audio source changes

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return; // Ensure audio element exists
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return; // Ensure audio element exists
    audio.currentTime = (e.target.value / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = () => {
    const audio = audioRef.current;
    if (!audio) return; // Ensure audio element exists
    audio.muted = !audio.muted;
    setVolume(audio.muted ? 0 : 1);
  };

  useEffect(() => {
    if (currentRecordingId) {
      // Fetch the recording when the currentRecordingId changes
      getRecordingById(currentRecordingId).then((recording) => {
        setAudioSrc(recording);
      });
    } else {
      setAudioSrc(null); // Reset audioSrc if there is no currentRecordingId
    }
  }, [currentRecordingId]);

  if (!audioSrc) return null; // Render nothing if no audio source

  return (
    <div className="audio-player">
      <h3>{audioSrc.title}</h3>
      <PlayButton togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
      <input
        type="range"
        min="0"
        max="100"
        value={duration ? (currentTime / duration) * 100 : 0}
        onChange={handleProgressChange}
        disabled={!duration} // Disable input if duration is not available
      />
      <span>
        {Math.floor(currentTime)} / {Math.floor(duration)}
      </span>
      <button onClick={handleVolumeChange}>{volume ? "Mute" : "Unmute"}</button>
      <audio autoPlay ref={audioRef} src={audioSrc.audio} />
    </div>
  );
}

export default AudioPlayer;
