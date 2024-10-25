import styled from "styled-components";
import { formatRecordingDate } from "../hooks/useDateTime";
import Button from "./Button";
import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import { useNavigate } from "react-router-dom";
import FavouriteIcon from "./FavouriteIcon";

const Title = styled.h4`
  color: var(--color-primary);
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: var(--color-bg);
  padding: 16px 8px 16px 8px;
  border-bottom: 1px solid var(--color-grey);
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  flex-grow: 0.25;
`;

const Image = styled.img`
  min-width: 140px;
  height: 100px;
  margin-right: 20px;
  border-radius: 8px;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0px 0px 0px 32px;
  gap: 8px;

  & > button {
    flex: 1;
  }
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
      <LeftSection>
        <Image src={recording.image || "/no-photo.svg"} />

        <Info>
          <Title>{recording.title}</Title>
          <div>Recorded {formatRecordingDate(recording.date)}</div>
          <div>
            {recording.locality}, {recording.country}
          </div>
        </Info>
      </LeftSection>
      <RightSection>
        <Buttons>
          {renderedBy == "profile" && (
            <Button
              variant="secondary"
              onClick={() => {
                handleClick();
              }}
            >
              View On Map
            </Button>
          )}
          <Button onClick={() => setCurrentRecordingId(recording.id)}>
            Play
          </Button>
        </Buttons>
        <FavouriteIcon recordingId={recording.id} />
      </RightSection>
    </Container>
  );
}

export default FavoritesItem;
