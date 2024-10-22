import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";

import { useState } from "react";
import Button from "../components/Button";
import UserAvatar from "../components/UserAvatar";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UserRecordings from "../components/UserRecordings";
import { useProfile } from "../features/authentication/profiles/useProfiles";
import FavoritesList from "../components/FavoritesList";

const PleaseLogin = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  gap: 0.25rem;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: start;
  margin: 80px 120px;
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
`;
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EditButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
`;

const ContentHeader = styled.div`
  padding-bottom: 12px;
  margin: 80px 120px 40px 120px;
  border-bottom: 1px solid var(--color-dkgrey);
`;

const ContentTab = styled.div`
  display: inline;
  margin: 12px 40px;
  font-size: 1.2rem;
  font-weight: 500;
  padding-bottom: 6px;
  color: var(--color-black);
  cursor: pointer;
  transition: border-bottom 0.2s;
  border-bottom: ${(props) =>
    props.$isActive ? "3px solid var(--color-primary)" : "none"};
`;

const Content = styled.div`
  margin: 0px 160px;
`;

function Profile() {
  const user = useUser();

  const [activeTab, setActiveTab] = useState("recordings");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const { profile, isLoading, error, refetch } = useProfile(user?.user?.id);

  const handleProfileUpdate = () => {
    refetch();
    setEditingProfile(false);
  };

  const handlePasswordUpdate = () => {
    setEditingPassword(false);
  };

  if (!user || !user.user) {
    return (
      <>
        <NavBar />
        <PleaseLogin>
          Please <Link to="/login">Login</Link>
        </PleaseLogin>
      </>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <>
      <NavBar />

      <ProfileSection>
        <ProfileContainer>
          <ProfileInfo>
            <UserAvatar size="large" />
            <h1>Profile for {profile.display_name || "User"}</h1>
            <p>Email: {profile.email_address}</p>
          </ProfileInfo>
          <EditButtons>
            {!editingProfile && !editingPassword && (
              <>
                <Button onClick={() => setEditingProfile(true)}>
                  Edit Profile
                </Button>
                <Button onClick={() => setEditingPassword(true)}>
                  Edit Password
                </Button>
              </>
            )}
          </EditButtons>
        </ProfileContainer>
      </ProfileSection>
      {editingProfile && (
        <UpdateUserDataForm
          onProfileUpdate={handleProfileUpdate}
          setEditingProfile={setEditingProfile}
        />
      )}
      {editingPassword && (
        <UpdatePasswordForm
          onPasswordUpdate={handlePasswordUpdate}
          setEditingPassword={setEditingPassword}
        />
      )}

      <ContentHeader>
        <ContentTab
          $isActive={activeTab === "recordings"}
          onClick={() => setActiveTab("recordings")}
        >
          Recordings
        </ContentTab>
        <ContentTab
          $isActive={activeTab === "favorites"}
          onClick={() => setActiveTab("favorites")}
        >
          Favourites
        </ContentTab>
      </ContentHeader>
      <Content>
        {activeTab === "favorites" && <FavoritesList renderedBy="profile" />}

        {activeTab === "recordings" && <UserRecordings userId={user.user.id} />}
      </Content>
    </>
  );
}

export default Profile;
