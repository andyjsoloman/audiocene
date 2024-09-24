import { useEffect, useState, useRef } from "react";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { getRecordingById } from "../services/apiRecordings";
import styled from "styled-components";
import PlayButton from "./PlayButton";
import VolumeControl from "./VolumeControl";

const AudioContainer = styled.div`
  width: 600px;
  height: 120px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

  border-radius: 12px;
  padding: 4px 12px 4px 40px;
  margin: 20px 40px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProgressContainer = styled.div`
  display: flex;
`;

const ProgressBar = styled.input.attrs({ type: "range" })`
  //remove baseline styles
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;

  /***** Track Styles *****/
  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  &::-webkit-slider-runnable-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  /******** Firefox ********/
  &&::-moz-range-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  &&::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -9px; /* Centers thumb on the track */
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  &&::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  width: 400px;
  margin-top: 12px;
  margin-bottom: 24px;
`;

const DurationContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VolumeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40%;
`;

const Title = styled.h4`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  margin-top: 24px;
`;

function AudioPlayer() {
  const { currentRecordingId } = useCurrentlyPlaying();
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleMute = () => {
    const audio = audioRef.current;
    isMuted ? setVolume(1) : setVolume(0);
    setIsMuted(!isMuted);
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
    <AudioContainer className="audio-player">
      <PlayButton togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
      <InfoContainer>
        <Title>{audioSrc.title}</Title>
        <DurationContainer>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </DurationContainer>
        <ProgressContainer>
          <ProgressBar
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
            disabled={!duration}
          />
        </ProgressContainer>
      </InfoContainer>
      <VolumeContainer>
        <VolumeControl
          handleVolumeChange={handleVolumeChange}
          volume={volume}
          handleMute={handleMute}
        />
      </VolumeContainer>
      <audio autoPlay ref={audioRef} src={audioSrc.audio} />
    </AudioContainer>
  );
}

export default AudioPlayer;
