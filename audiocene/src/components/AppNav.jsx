import { NavLink as BaseNavLink } from "react-router-dom";
import styled from "styled-components";

const NavWrapper = styled.ul`
  display: flex;
  justify-content: space-evenly;
  padding-inline-start: 0px;
  margin-bottom: 40px;
`;

const NavItem = styled.li`
  display: flex;
`;

const NavLink = styled(BaseNavLink)`
  text-decoration: none;
  font-size: 1.3rem;
  color: var(--color-black);
  padding-bottom: 12px;

  &.active {
    border-bottom: 3px solid var(--color-primary);
  }
`;

export default function AppNav() {
  return (
    <nav>
      <NavWrapper>
        <NavItem>
          <NavLink to="explore">Explore</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="add">Upload</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="favourites">Favourites</NavLink>
        </NavItem>
      </NavWrapper>
    </nav>
  );
}
