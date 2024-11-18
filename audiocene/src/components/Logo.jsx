import { Link } from "react-router-dom";
import styled from "styled-components";

const LogoContainer = styled.div`
  width: 150px;
`;

const LogoImg = styled.img`
  min-width: 100px;
`;

function Logo() {
  return (
    <LogoContainer>
      <Link to="/">
        <LogoImg src="/header_logo.svg" alt="Audiocene logo" />
      </Link>
    </LogoContainer>
  );
}

export default Logo;
