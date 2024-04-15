import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <img src="audiocene/public/headerlogo.svg" alt="Audiocene logo" />
    </Link>
  );
}

export default Logo;
