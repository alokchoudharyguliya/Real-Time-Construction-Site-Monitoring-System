import React, { useState } from 'react';
import './Navbar.css'; // Create this file for styling

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="navbar">
      <h3 className="logo">YourLogo</h3>
      <ul
        className={isMobile ? `nav-links-mobile active` : "nav-links"}
        onClick={() => setIsMobile(false)}
      >
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>


      <button className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}>
        <svg className={isMobile ? `rotate90` : 'rotate0'} width="39" height="39" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55229 20.5523 8 20 8H4C3.44772 8 3 7.55229 3 7Z" fill="white" />
          <path d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5522 3.44772 13 4 13H20C20.5523 13 21 12.5522 21 12C21 11.4477 20.5523 11 20 11H4Z" fill="white" />
          <path d="M3 17C3 16.4477 3.44772 16 4 16H20C20.5523 16 21 16.4477 21 17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17Z" fill="white" />
        </svg>

      </button>

    </nav>
  );
}

export default Navbar;
