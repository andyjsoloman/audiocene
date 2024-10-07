import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";
import { getProfileById } from "../services/apiProfiles";
import { useEffect, useState } from "react";

const PleaseLogin = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  gap: 0.25rem;
`;

function Profile() {
  const user = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Async function to fetch the profile
  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const data = await getProfileById(userId);
      setProfile(data);
      console.log(profile);
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
    <div>
      <NavBar />
      <h1>Profile for {profile.display_name || "User"}</h1>
      <p>Email: {profile.email_address}</p>
    </div>
  );
}

export default Profile;
