import styled from "styled-components";

const AvatarImg = styled.img`
  outline: 4px solid var(--color-primary);
  border-radius: 50%;
  outline-offset: 2px;

  height: 6rem;
  width: 6rem;
`;

function Avatar() {
  return <AvatarImg src="../profile.svg" alt="profile picture"></AvatarImg>;
}

export default Avatar;
