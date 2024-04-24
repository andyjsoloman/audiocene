import { NavLink } from "react-router-dom";

function AppNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="explore">Explore</NavLink>
        </li>
        <li>
          <NavLink to="add">Upload</NavLink>
        </li>
        <li>
          <NavLink to="favourites">Favourites</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
