import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

// Navbar component that includes a logo and profile image.
const Navbar = () => {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <img className="profile" src={assets.profile_image} alt="" />
    </div>
  );
};

export default Navbar;
