import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const VolumeControlContainer = styled.div`
  position: relative;
  display: none;
  height: 100px;
  width: 20px;
  background-color: #ccc;
  cursor: pointer;
  &.hidden {
    display: block;
  }
`;

const Slider = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #ddd;
`;

const Progress = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #007bff;
`;

const Pin = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  background-color: #007bff;
  cursor: grab;
`;

const VolumeControl = ({ audioRef }) => {
  const [volume, setVolume] = useState(1); // Volume ranges from 0 to 1
  const sliderRef = useRef(null);
  const progressRef = useRef(null);
  const pinRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const updateVolume = (volume) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    };

    updateVolume(volume);
  }, [volume, audioRef]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const offsetY = rect.bottom - e.clientY;
    let newVolume = offsetY / rect.height;
    newVolume = Math.min(1, Math.max(0, newVolume)); // Ensure volume is between 0 and 1

    setVolume(newVolume);
  };

  return (
    <VolumeControlContainer
      className="hidden"
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Slider>
        <Progress ref={progressRef} style={{ height: `${volume * 100}%` }} />
        <Pin
          ref={pinRef}
          style={{ bottom: `${volume * 100}%` }}
          onMouseDown={handleMouseDown}
        />
      </Slider>
    </VolumeControlContainer>
  );
};

export default VolumeControl;
