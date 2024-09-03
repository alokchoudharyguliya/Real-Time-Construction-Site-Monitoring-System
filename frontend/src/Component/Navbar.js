import React, { useState } from 'react';
import './Navbar.css'; // Create this file for styling

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="navbar">
      <h3 className="logo">YourLogo</h3>
      <ul className={isMobile ? `nav-links-mobile` : "nav-links"}
          onClick={() => setIsMobile(false)}>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>


      <button className="mobile-menu-icon"
              onClick={() => setIsMobile(!isMobile)}>
        <i className ={`bx bx-menu ${isMobile ? 'rotate': ''}`}></i>
      </button>
      
    </nav>
  );
}

export default Navbar;
