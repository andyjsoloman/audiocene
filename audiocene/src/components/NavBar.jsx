import { NavLink as BaseNavLink } from "react-router-dom";
import styled from "styled-components";
import Logo from "./Logo";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
`;

const NavUl = styled.ul`
  display: flex;
  align-items: center;
  gap: 4rem;
`;

const NavLi = styled.li`
  list-style: none;
  display: flex;
  /* text-transform: uppercase; */
`;

const NavLink = styled(BaseNavLink)`
  text-decoration: none;
  background-color: #abefed;
  padding: 8px 16px;
  border-radius: 4px;
`;

function NavBar() {
  return (
    <Nav>
      <Logo />
      <NavUl>
        <NavLi>
          <NavLink to="/app">Explore</NavLink>
        </NavLi>
        <NavLi>
          <NavLink to="/about">About</NavLink>
        </NavLi>
        <NavLi>
          <NavLink to="/login">Login</NavLink>
        </NavLi>
      </NavUl>
    </Nav>
  );
}

export default NavBar;
