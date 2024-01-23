import React, {useRef} from "react";
import logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
const Header = () => {
    const targetElementRef = useRef(null);
    const navigateToElement = () => {
        const targetElement = document.getElementById('yourElementId');
    
        if (targetElement) {
          // Scroll to the target element or perform any other action
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      };
    
  return (
    <div className="flex border border-gray-300 shadow-md border-b justify-between items-center p-4">
      <div>
        {" "}
        <img src={logo} alt="logo" width={150} height={150} />{" "}
      </div>
      <p className="hidden font-bold text-3xl md:block">Lyon Institute for Geostrategy & Multicultural Relations</p>
      <p className="block font-bold text-3xl md:hidden">LIGMR</p>
      <a className="font-bold text-5xl flex items-center space-x-2 cursor-pointer"
      href="#footer"
       style={{
        color: "#EA1D1A"
      }}>
        <FaUserCircle />
      </a>
    </div>
  );
};

export default Header;
