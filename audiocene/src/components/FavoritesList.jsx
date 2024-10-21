/* eslint-disable react/prop-types */

import { useUser } from "../features/authentication/useUser";
import { useFavoritesByUserId } from "../features/favorites/useFavorites";
import { useRecordingsByIds } from "../features/recordings/useRecordings";
import FavoritesItem from "./FavoritesItem";
import styled from "styled-components";

const List = styled.ul`
  padding-inline-start: 0px;
`;

function FavoritesList() {
  const user = useUser();

  const { isLoading, error, favorites } = useFavoritesByUserId(user?.user?.id);

  const safeFavorites = favorites ?? [];

  const recordingIds =
    safeFavorites.map((favorite) => favorite.recording_id) || [];

  const { loadingRecordingsByIds, recordingsByIds, recordingsByIdsError } =
    useRecordingsByIds(recordingIds);

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <List>
      {recordingsByIds?.map((recording) => (
        <FavoritesItem key={recording.id} recording={recording} />
      ))}
    </List>
  );
}

export default FavoritesList;
