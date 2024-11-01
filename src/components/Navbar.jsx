import { NavbarData } from "../data/Navbar";
import { NavLink } from "react-router-dom";
import pasteIcon from "./paste-icon.png";

const Navbar = () => {
  return (
    <div className="w-full h-[66px] flex justify-center items-center p-4 bg-black relative">
      {/* Logo positioned on the left */}
      <div className="absolute left-4 md:left-12 border-spacing-3 flex items-center space-x-2 md:space-x-4">
        <img
          src={pasteIcon}
          alt="Paste App Logo"
          className="h-8 w-8 md:h-10 md:w-10 transition duration-300 hover:scale-125 hover:shadow-md hover:shadow-blue-700"
        />
        {/* "Paste App" text hidden on small screens */}
        <h1 className="hidden md:block font-bold text-white text-lg md:text-3xl hover:scale-110 transition duration-300 hover:rounded-full">
          Paste App
        </h1>
      </div>

      {/* Navbar Links that shift right on smaller screens */}
      <div className="flex gap-x-2 md:gap-x-5 transition-all duration-300 transform sm:translate-x-12 md:translate-x-0">
        {NavbarData.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 border-b border-blue-700 font-bold text-lg  sm:text-xl transition duration-300 hover:scale-110"
                : "text-white font-bold text-lg sm:text-xl transition duration-300 hover:scale-110"
            }
          >
            {link.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
