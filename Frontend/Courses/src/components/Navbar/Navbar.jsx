import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdown(!dropdown);

  const activeClass = "text-blue-600 font-medium";
  const normalClass = "text-gray-800 hover:text-blue-600";

  const handleLogout = () => {
    logout();
    setDropdown(false);
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/courses`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }).then(() => {
      
    });
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" onClick={closeMenu}>
            <span className="text-xl font-bold text-blue-600">Yalla</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/findteacher" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              Find a teacher
            </NavLink>
            <NavLink to="/about-us" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              About us
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {user ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center gap-2 text-gray-800">
                  {user.name}
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs">▼</span>
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded py-2 z-10">
                    {user && user.role !== "admin" && (
                      <NavLink
                        to="/myprofile"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setDropdown(false)}
                      >
                        My Profile
                      </NavLink>
                    )}
                    {user.role === "admin" && (
                      <NavLink
                        to="/admin"
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setDropdown(false)}
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 py-4">
            <NavLink to="/findteacher" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              Find a teacher
            </NavLink>
            <NavLink to="/about-us" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              About us
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
              Contact
            </NavLink>
            {user ? (
              <>
                {user && user.role !== "admin" && (
                  <NavLink to="/myprofile" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                    My Profile
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                    Admin Dashboard
                  </NavLink>
                )}
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                  <button onClick={handleLogout} className="text-red-500 text-sm ml-auto">Log out</button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
