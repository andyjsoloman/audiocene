import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import supabase from "../services/supabase";
import UserAvatar from "./UserAvatar";

const UserContainer = styled.div`
  background-color: var(--color-bg);
  position: relative;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  display: block;
  top: 100%;
  right: 0px;
  margin-top: 0.8rem;
  padding-inline-start: 0px;
  background-color: var(--color-bg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 550;
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
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [session, setSession] = useState(null);
  const dropDownRef = useRef(null);
  const triggerRef = useRef(null);

  function toggleDropdown() {
    setDropDownOpen(!dropDownOpen);
  }

  const handleClickOustide = (event) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target) &&
      !triggerRef.current.contains(event.target)
    ) {
      setDropDownOpen(false);
    }
  };

  useEffect(() => {
    if (dropDownOpen) {
      document.addEventListener("mousedown", handleClickOustide);
    } else {
      document.removeEventListener("mousedown", handleClickOustide);
    }
    return () => document.removeEventListener("mousedown", handleClickOustide);
  }, [dropDownOpen]);

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

  function goToProfile() {
    navigate(`/profile/${user.id}`);
  }

  return (
    <>
      <UserContainer
        ref={triggerRef}
        onClick={toggleDropdown}
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={dropDownOpen}
        aria-label="User menu"
        id="user-menu-trigger"
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
        {dropDownOpen && (
          <Dropdown
            role="menu"
            ref={dropDownRef}
            aria-labelledby="user-menu-trigger"
          >
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
