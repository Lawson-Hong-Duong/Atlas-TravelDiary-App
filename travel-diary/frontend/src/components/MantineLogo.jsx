import React from "react";
import { useNavigate } from "react-router-dom";
import atlasTravelsIcon from "../assets/images/Atlas-Travels-Title-Logo.png"; 

const MantineLogo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <img
      src={atlasTravelsIcon}
      alt="Atlas Travels Icon"
      style={{ height: "40px", width: "auto", cursor: "pointer" }}
      onClick={handleLogoClick}
    />
  );
};

export default MantineLogo;
