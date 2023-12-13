// REUSABLE NAVBAR COMPONENT
import Link from "next/link";
import Logo from "./Logo";

const Navbar = ({ link1, link2, link3, link1To, link2To, link3To }) => {
  return (
    <div className="">
      <nav className="p-3 text-900 w-full flex flex-row justify-content-between align-items-center fixed bg-white shadow-1 z-5">
        <Logo />
        <div>
          {link1 && link1To && (
            <Link legacyBehavior href={link1To}>
              <a className="p-3 text-900 font-medium">{link1}</a>
            </Link>
          )}
          {link2 && link2To && (
            <Link legacyBehavior href={link2To}>
              <a className="p-3 text-900 font-medium">{link2}</a>
            </Link>
          )}
          {link3 && link3To && (
            <Link legacyBehavior href={link3To}>
              <a className="p-3 text-900 font-medium">{link3}</a>
            </Link>
          )}
        </div>
        <button className="hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>
      <div>
        {link1 && link1To && (
          <Link legacyBehavior href={link1To}>
            <a>{link1}</a>
          </Link>
        )}
        {link2 && link2To && (
          <Link legacyBehavior href={link2To}>
            <a>{link2}</a>
          </Link>
        )}
        {link3 && link3To && (
          <Link legacyBehavior href={link3To}>
            <a>{link3}</a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
