import { NavLink as BaseNavLink } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";

const NavWrapper = styled.ul`
  display: flex;
  justify-content: space-evenly;
  padding-inline-start: 0px;
  margin-bottom: 20px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--color-dkgrey);
`;

const NavItem = styled.li`
  display: flex;
`;

const NavLink = styled(BaseNavLink)`
  display: inline;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-black);
  padding-bottom: 6px;

  &.active {
    border-bottom: 3px solid var(--color-primary);
  }
`;

export default function AppNav() {
  const { user } = useUser();

  return (
    <nav>
      <NavWrapper>
        <NavItem>
          <NavLink to="explore">Explore</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="add">Upload</NavLink>
        </NavItem>
        {user && (
          <NavItem>
            <NavLink to="favourites">Favourites</NavLink>
          </NavItem>
        )}
      </NavWrapper>
    </nav>
  );
}
