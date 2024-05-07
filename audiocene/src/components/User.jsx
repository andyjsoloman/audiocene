import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";

const UserContainer = styled.div`
  background-color: var(--color-bg);
  padding: 1rem 0.5rem;
  border-radius: 7px;
  z-index: 999;
  /* box-shadow: 0 0.8rem 2.4rem rgba(36, 42, 46, 0.5); */
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "metallophile-sp8", sans-serif;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const UserImg = styled.img`
  height: 2rem;
`;

// const UserButton = styled.button`
//   background-color: var(--color-black);
//   border-radius: 7px;
//   border: none;
//   padding: 0.6rem 1.2rem;
//   color: inherit;
//   font-family: inherit;
//   font-size: 1.2rem;
//   font-weight: 700;
//   text-transform: uppercase;
//   cursor: pointer;
// `;

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <>
      {user && (
        <UserContainer>
          <UserImg src="../profile.svg" alt={user.name} />
          <span>Welcome, {user.name}</span>
          {/* <UserButton onClick={handleClick}>Logout</UserButton> */}
        </UserContainer>
      )}
    </>
  );
}

export default User;
