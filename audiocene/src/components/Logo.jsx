import { Link } from "react-router-dom";
import styled from "styled-components";

const LogoContainer = styled.div`
  width: 150px;
`;

function Logo() {
  return (
    <LogoContainer>
      <Link to="/">
        <img src="../public/header_logo.svg" alt="Audiocene logo" />
      </Link>
    </LogoContainer>
  );
}

export default Logo;
