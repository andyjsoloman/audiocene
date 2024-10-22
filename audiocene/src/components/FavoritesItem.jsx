import styled from "styled-components";
import { formatRecordingDate } from "../hooks/useDateTime";
import Button from "./Button";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { useNavigate } from "react-router-dom";

const Title = styled.h4`
  color: var(--color-primary);
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: var(--color-bg);
  padding: 16px 8px 16px 8px;
  border-bottom: 1px solid var(--color-grey);
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

function FavoritesItem({ recording, renderedBy }) {
  const { setCurrentRecordingId } = useCurrentlyPlaying();
  const navigate = useNavigate();

  const handleClick = () => {
    renderedBy === "map" &&
      navigate(
        `../explore/${recording.id}?id=${recording.id}&lat=${recording.position.lat}&lng=${recording.position.lng}`
      );
    renderedBy === "profile" &&
      navigate(
        `../app/explore/${recording.id}?id=${recording.id}&lat=${recording.position.lat}&lng=${recording.position.lng}`
      );
    //Back button does not work as intended after this navigate
  };

  return (
    <Container>
      <Info>
        <Title
          onClick={() => {
            handleClick();
          }}
        >
          {recording.title}
        </Title>
        <div>Recorded at {formatRecordingDate(recording.date)}</div>
        <div>
          {recording.locality}, {recording.country}
        </div>
      </Info>
      <Buttons>
        <Button onClick={() => setCurrentRecordingId(recording.id)}>
          Play
        </Button>
      </Buttons>
    </Container>
  );
}

export default FavoritesItem;
