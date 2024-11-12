import NavBar from "../components/NavBar";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";

import { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import UserAvatar from "../components/UserAvatar";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UserRecordings from "../components/UserRecordings";
import { useProfile } from "../features/authentication/profiles/useProfiles";
import FavoritesList from "../components/FavoritesList";
import styled from "styled-components";

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
  display: flex;
`;

const ContentTab = styled.div`
  display: inline;
  margin: 0 40px;
  font-size: 1.2rem;
  font-weight: 500;
  padding-bottom: 6px;
  color: var(--color-black);
  cursor: pointer;
  transition: border-bottom 0.2s;
  border-bottom: ${(props) =>
    props.$isActive ? "3px solid var(--color-primary)" : "none"};

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

const Content = styled.div`
  margin: 0px 160px;
`;

function Profile() {
  const user = useUser();
  const profileUrl = useParams();

  const isCurrentUser = user?.user?.id == profileUrl.id;

  //The profile should be fetched with profileUrl, and conditional rendering based on if user = profileUrl

  const [activeTab, setActiveTab] = useState("recordings");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const { profile, isLoading, error, refetch } = useProfile(profileUrl.id);

  const avatar = profile?.avatar_url;

  const handleProfileUpdate = () => {
    refetch();
    setEditingProfile(false);
  };

  const handlePasswordUpdate = () => {
    setEditingPassword(false);
  };

  // Refs for tabs to manage focus
  const tabsRef = useRef([]);

  // Function to handle tab switching
  const switchTab = (currentTab, newTab) => {
    // Update aria-selected
    setActiveTab(newTab.getAttribute("data-tab"));

    // Update tabindex
    tabsRef.current.forEach((tab) => {
      if (tab === newTab) {
        tab.setAttribute("tabindex", "0");
      } else {
        tab.setAttribute("tabindex", "-1");
      }
    });
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    const key = e.which || e.keyCode;
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    const ENTER = 13;
    const SPACE = 32;

    const currentIndex = tabsRef.current.indexOf(e.currentTarget);
    let newIndex = null;

    if (key === LEFT_ARROW) {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = tabsRef.current.length - 1; // Loop to last tab
      }
    } else if (key === RIGHT_ARROW) {
      newIndex = currentIndex + 1;
      if (newIndex >= tabsRef.current.length) {
        newIndex = 0; // Loop to first tab
      }
    } else if (key === ENTER || key === SPACE) {
      // Activate the current tab
      switchTab(e.currentTarget, e.currentTarget);
      return;
    }

    if (newIndex !== null) {
      e.preventDefault();
      switchTab(e.currentTarget, tabsRef.current[newIndex]);
      tabsRef.current[newIndex].focus();
    }
  };

  useEffect(() => {
    // Initialize tabindex when activeTab changes
    tabsRef.current.forEach((tab) => {
      if (tab.getAttribute("data-tab") === activeTab) {
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
      } else {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      }
    });
  }, [activeTab]);

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
            <UserAvatar avatar={avatar} size="large" />
            <h1>Profile for {profile.display_name || "User"}</h1>
            {isCurrentUser && <p>Email: {profile.email_address}</p>}
          </ProfileInfo>
          {isCurrentUser && (
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
          )}
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

      {/* ARIA Tablist */}
      <ContentHeader role="tablist" aria-label="Profile Content Tabs">
        <ContentTab
          role="tab"
          aria-selected={activeTab === "recordings"}
          data-tab="recordings"
          $isActive={activeTab === "recordings"}
          tabIndex={activeTab === "recordings" ? "0" : "-1"}
          onClick={() => setActiveTab("recordings")}
          onKeyDown={handleKeyDown}
          ref={(el) => (tabsRef.current[0] = el)}
        >
          Recordings
        </ContentTab>
        {isCurrentUser && (
          <ContentTab
            role="tab"
            aria-selected={activeTab === "favorites"}
            data-tab="favorites"
            $isActive={activeTab === "favorites"}
            tabIndex={activeTab === "favorites" ? "0" : "-1"}
            onClick={() => setActiveTab("favorites")}
            onKeyDown={handleKeyDown}
            ref={(el) => (tabsRef.current[1] = el)}
          >
            Favourites
          </ContentTab>
        )}
      </ContentHeader>
      <Content role="tabpanel" aria-labelledby={activeTab} tabIndex="0">
        {activeTab === "favorites" && <FavoritesList renderedBy="profile" />}

        {activeTab === "recordings" && (
          <UserRecordings userId={user.user.id} renderedBy="profile" />
        )}
      </Content>
    </>
  );
}

export default Profile;
