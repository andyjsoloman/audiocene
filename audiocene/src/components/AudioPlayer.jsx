import { useEffect, useState, useRef } from "react";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { getRecordingById } from "../services/apiRecordings";
import styled from "styled-components";
import PlayButton from "./PlayButton";
import VolumeControl from "./VolumeControl";

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

    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (e.target.value / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return; // Ensure audio element exists
    audio.volume = e.target.value / 100;
    setVolume(audio.volume);
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

  const formatTime = (time) => {
    if (typeof time === "number" && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      // Convert to string and pad with leading zeros if necessary
      const formatMinutes = minutes.toString().padStart(2, "0");
      const formatSeconds = seconds.toString().padStart(2, "0");
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  if (!audioSrc) return null;

  return (
    <div className="audio-player">
      <h3>{audioSrc.title}</h3>
      <PlayButton togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
      <span>{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={duration ? (currentTime / duration) * 100 : 0}
        onChange={handleProgressChange}
        disabled={!duration}
      />
      <span>{formatTime(duration)}</span>

      <VolumeControl handleVolumeChange={handleVolumeChange} volume={volume} />
      <audio autoPlay ref={audioRef} src={audioSrc.audio} />
    </div>
  );
}

export default AudioPlayer;
