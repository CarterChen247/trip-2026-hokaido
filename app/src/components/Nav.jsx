import { NavLink } from "react-router-dom";
import "./Nav.css";

const LINKS = [
  { to: "/", label: "行程看板" },
  { to: "/map", label: "地點地圖" },
];

export default function Nav() {
  return (
    <nav className="app-nav">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) => "app-nav-link" + (isActive ? " active" : "")}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
