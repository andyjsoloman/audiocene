import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import supabase from "../services/supabase";
import UserAvatar from "./UserAvatar";

const UserContainer = styled.div`
  background-color: var(--color-bg);
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "metallophile-sp8", sans-serif;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  position: relative;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  display: block;
  top: 100%;
  right: -40px;
  margin-top: 0.8rem;
  padding-inline-start: 0px;
  background-color: var(--color-bg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 3;
  min-width: 160px;
`;

const DropdownItem = styled.li`
  font-family: var(--font-body);
  display: block;

  padding: 8px 12px;
  font-size: 1rem;
  color: var(--color-black);
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--color-light-gray);
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

function UserMenu() {
  const { logout, isLoading } = useLogout();
  const { user } = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the current session when the component mounts
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
      }
    };

    // Call the function to fetch session
    fetchSession();

    // Set up the auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Clean up the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <div>Loading...</div>; // or any loading state
  }

  const fullName = session?.user?.user_metadata?.fullName || "Guest";

  const { avatar } = user.user_metadata;

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function goToProfile() {
    navigate(`/profile/${user.id}`);
  }

  return (
    <>
      <UserContainer
        onClick={toggleDropdown}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <UserAvatar avatar={avatar} size="small" />
        {/* <span>Welcome, {fullName} </span> */}
        {/* <UserButton onClick={handleClick}>Logout</UserButton> */}
        {dropdownOpen && (
          <Dropdown role="menu">
            <DropdownItem
              role="menuitem"
              tabIndex={0}
              onClick={goToProfile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToProfile();
                }
              }}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              role="menuitem"
              tabIndex={0}
              onClick={logout}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  logout();
                }
              }}
            >
              Logout
            </DropdownItem>
          </Dropdown>
        )}
      </UserContainer>
    </>
  );
}

export default UserMenu;
