import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";
import { getProfileById } from "../services/apiProfiles";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import UserAvatar from "../components/UserAvatar";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";

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

  width: 50%;
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
  gap: 4px;
`;

const ContentHeader = styled.div`
  padding-bottom: 12px;
  margin: 80px 120px;
  border-bottom: 1px solid var(--color-grey);
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

function Profile() {
  const user = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Async function to fetch the profile
  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const data = await getProfileById(userId);
      setProfile(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.user?.id) {
      fetchProfile(user.user.id);
    }
  }, [user?.user?.id]);

  const handleProfileUpdate = () => {
    if (user.user?.id) {
      fetchProfile(user.user.id);
    }
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

  if (loading) return <p>Loading...</p>;
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
            <Button onClick={() => setEditingProfile(true)}>
              Edit Profile
            </Button>
            <Button onClick={() => setEditingPassword(true)}>
              Edit Password
            </Button>
          </EditButtons>
        </ProfileContainer>
      </ProfileSection>
      {editingProfile && (
        <UpdateUserDataForm
          onProfileUpdate={handleProfileUpdate}
          setEditingProfile={setEditingProfile}
        />
      )}
      {editingPassword && <UpdatePasswordForm />}

      <ContentHeader>
        <ContentTab
          $isActive={activeTab === "tab1"}
          onClick={() => setActiveTab("tab1")}
        >
          Recordings
        </ContentTab>
        <ContentTab
          $isActive={activeTab === "tab2"}
          onClick={() => setActiveTab("tab2")}
        >
          Favourites
        </ContentTab>
      </ContentHeader>
    </>
  );
}

export default Profile;
