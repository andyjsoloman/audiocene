import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { useState } from "react";

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

const UserImg = styled.img`
  height: 2rem;
`;

const Dropdown = styled.div`
  position: absolute;
  display: block;
  top: 100%;
  right: -40px;
  margin-top: 0.8rem;
  background-color: var(--color-bg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 3;
  min-width: 160px;
`;

const DropdownItem = styled.div`
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

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function goToProfile() {
    navigate("/app/profile");
  }

  return (
    <>
      {user && (
        <>
          <UserContainer onClick={toggleDropdown}>
            <UserImg src="../profile.svg" alt={user.name} />
            <span>Welcome, {user.name}</span>
            {/* <UserButton onClick={handleClick}>Logout</UserButton> */}
            {dropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={goToProfile}>Profile</DropdownItem>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </Dropdown>
            )}
          </UserContainer>
        </>
      )}
    </>
  );
}

export default User;
