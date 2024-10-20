import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useFavoriteByIds } from "../features/favorites/useFavorites";
import { useDeleteFavorite } from "../features/favorites/useDeleteFavorite";
import { useCreateFavorite } from "../features/favorites/useCreateFavorite";

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

  const { isLoading, error, favorite } = useFavoriteByIds(
    currentUser?.id,
    recording?.id
  );

  const { isDeleting, deleteFavorite } = useDeleteFavorite();

  const { isAdding, addFavorite } = useCreateFavorite();

  useEffect(() => {
    if (favorite) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  }, [favorite]);

  const toggleFavourite = () => {
    if (isFavourite) {
      deleteFavorite({ userId: currentUser.id, recordingId: recording.id });
    } else {
      addFavorite({ userId: currentUser.id, recordingId: recording.id });
    }
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
                <div>Recorded at {formatRecordingDate(recording.date)}</div>
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
