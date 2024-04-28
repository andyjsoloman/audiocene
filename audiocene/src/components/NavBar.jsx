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
  font-size: 1.3rem;
  color: var(--color-black);
  background-color: var(--color-bg);
  padding: 8px 16px;
  border-radius: 4px;
  font-family: "metallophile-sp8", sans-serif;
  font-weight: 500;

  &.active {
    color: var(--color-primary);
  }
`;

function NavBar() {
  return (
    <Nav>
      <Logo />
      <NavUl>
        <NavLi>
          <NavLink to="/app/explore">Explore</NavLink>
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
