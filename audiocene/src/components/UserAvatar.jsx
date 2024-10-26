import { useUser } from "../features/authentication/useUser";
import styled from "styled-components";

const SIZES = {
  small: {
    "--outline": 2 + "px solid var(--color-primary)",
    "--outline-offset": 1 + "px",
    "--height": 2 + "rem",
    "--width": 2 + "rem",
  },
  medium: {
    "--outline": 4 + "px solid var(--color-primary)",
    "--outline-offset": 2 + "px",
    "--height": 4 + "rem",
    "--width": 4 + "rem",
  },
  large: {
    "--outline": 4 + "px solid var(--color-primary)",
    "--outline-offset": 2 + "px",
    "--height": 6 + "rem",
    "--width": 6 + "rem",
  },
};

const AvatarImg = styled.img`
  outline: var(--outline);
  border-radius: 50%;
  outline-offset: var(--outline-offset);

  height: var(--height);
  width: var(--width);
`;

function UserAvatar({ size, avatar }) {
  const styles = SIZES[size];

  return (
    <AvatarImg
      style={styles}
      src={avatar || "../profile.svg"}
      alt="profile picture"
    ></AvatarImg>
  );
}

export default UserAvatar;
