import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import BackButton from "./BackButton";

import { useCurrentlyPlaying } from "../contexts/CurrentlyPlayingContext";
import Button from "./Button";
import styled from "styled-components";
import Form from "./Form";
import { useUser } from "../features/authentication/useUser";
import { useRecordings } from "../features/recordings/useRecordings";

import DeleteButton from "./DeleteButton";
import FavouriteIcon from "./FavouriteIcon";
import { formatRecordingDate } from "../hooks/useDateTime";

import { useTransformImage } from "../hooks/useTransformImage";

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
  width: 100%;
  margin: auto;
  margin-bottom: 24px;
  object-fit: cover;
`;
const PlaceHolderImage = styled.img`
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
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const {
    loadingRecording,
    recording,
    recordingError,
    loadingUser,
    user,
    userError,
  } = useRecordings(null, id);

  const handleProfileLink = () => {
    navigate(`/profile/${user.id}`);
  };

  const transformedImage = useTransformImage(recording?.image, 450);

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
            {recording.image ? (
              <RecordingImage src={recording.image} alt="recording photo" />
            ) : (
              <PlaceHolderImage src="/no-photo.svg" alt="no photo uploaded" />
            )}
            <InfoPanel>
              <RecordingInfo>
                <div>Recorded at {formatRecordingDate(recording.date)}</div>
                <div>
                  {recording.locality}, {recording.country}
                </div>
                {user && (
                  <div>
                    Uploaded by:
                    <Button
                      variant="tertiary"
                      type="button"
                      onClick={handleProfileLink}
                    >
                      {user.display_name}
                    </Button>
                  </div>
                )}
              </RecordingInfo>
              <FavouriteButton>
                <FavouriteIcon recordingId={recording.id} />
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
