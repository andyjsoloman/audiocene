import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BackButton from "./BackButton";
import { getRecordingById } from "../services/apiRecordings";
import { getProfileById } from "../services/apiProfiles";

import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import Button from "./Button";
import styled from "styled-components";
import Form from "./Form";
import { useUser } from "../features/authentication/useUser";
import { useRecordings } from "../features/recordings/useRecordings";

import DeleteButton from "./DeleteButton";
import FavouriteIcon from "./FavouriteIcon";

const DetailPanel = styled.div`
  position: flex;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
`;

const RecordingImage = styled.img`
  height: 180px;
  margin: auto;
  margin-bottom: 24px;
`;

const InfoPanel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RecordingInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FavouriteButton = styled.div``;

function RecordingDetail() {
  const { id } = useParams();
  const { setCurrentRecordingId } = useCurrentlyPlaying();
  const [isEditing, setIsEditing] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const { user: currentUser } = useUser();

  const {
    loadingRecording,
    recording,
    recordingError,
    loadingUser,
    user,
    userError,
  } = useRecordings(null, id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    return `${formattedDate} at ${formattedTime}`;
  };

  const toggleFavourite = () => {
    setIsFavourite(!isFavourite);
  };

  if (loadingRecording || loadingUser) {
    return <div>Loading...</div>;
  }

  if (recordingError) {
    return <div>Error: {recordingError.message}</div>;
  }

  if (userError) {
    return <div>Error fetching user: {userError.message}</div>;
  }

  return (
    <>
      <DetailPanel>
        <DetailHeader>
          <Title>{recording.title}</Title>
          {user.id == currentUser.id && (
            <HeaderButtons>
              <Button
                variant="tertiary"
                onClick={() => setIsEditing((editing) => !editing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <DeleteButton id={recording.id} />
            </HeaderButtons>
          )}
        </DetailHeader>
        {isEditing && <Form recordingToEdit={recording} />}

        {!isEditing && (
          <>
            <RecordingImage src="/no-photo.svg"></RecordingImage>
            <InfoPanel>
              <RecordingInfo>
                <div>Recorded at {formatDate(recording.date)}</div>
                <div>
                  {recording.locality}, {recording.country}
                </div>
                {user && <div>Uploaded by: {user.display_name}</div>}
              </RecordingInfo>
              <FavouriteButton>
                <FavouriteIcon
                  isFavourite={isFavourite}
                  onClick={toggleFavourite}
                />
              </FavouriteButton>
            </InfoPanel>

            <ButtonRow>
              <BackButton />
              <Button onClick={() => setCurrentRecordingId(id)}>Play</Button>
            </ButtonRow>
          </>
        )}
      </DetailPanel>
    </>
  );
}

export default RecordingDetail;
