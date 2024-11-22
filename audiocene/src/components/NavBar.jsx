import { NavLink as BaseNavLink } from "react-router-dom";
import styled from "styled-components";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import { QUERIES } from "../constants";
import HamburgerMenu from "./HamburgerMenu";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;

  @media ${QUERIES.mobile} {
    padding: 12px 20px;
  }
`;

const NavUl = styled.ul`
  display: flex;
  align-items: center;
  gap: 4rem;

  @media ${QUERIES.mobile} {
    gap: 2rem;
  }
`;

const NavLi = styled.li`
  list-style: none;
  display: flex;
  /* text-transform: uppercase; */

  @media ${QUERIES.tablet} {
    display: none;
    position: fixed;
  }
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
  const { user } = useUser();
  const { loggedOut } = useLogout();

  return (
    <Nav>
      <Logo />

      <NavUl>
        <HamburgerMenu />
        <NavLi>
          <NavLink to="/app/explore">Explore</NavLink>
        </NavLi>
        <NavLi>
          <NavLink to="/about">About</NavLink>
        </NavLi>
        {user ? (
          <UserMenu key={loggedOut ? "logged-out" : "logged-in"} />
        ) : (
          <NavLi>
            <NavLink to="/login">Login</NavLink>
          </NavLi>
        )}
      </NavUl>
    </Nav>
  );
}

export default NavBar;
