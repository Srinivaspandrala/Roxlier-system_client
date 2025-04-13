import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 
import Cookie from "js-cookie";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate(); 

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const username = Cookie.get("username"); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏪 <span>Store<span className="highlight">Dash</span></span></div>

      <div className="navbar-user" ref={dropdownRef}>
        <span className="username" onClick={toggleDropdown}>{username}</span>
        <div className="user-avatar" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
        </div>

        {dropdownOpen && (
          <div className="dropdown animated-dropdown">
            <button onClick={() => navigate('/changepassword')}>
              <FontAwesomeIcon icon={faKey} /> Change Password
            </button>
            <button onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
