import { NavLink } from "react-router-dom";

import Logo from "./Logo";

function NavBar() {
  return (
    <nav>
      <Logo />
      <ul>
        <li>
          <NavLink to="/app">Explore</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
