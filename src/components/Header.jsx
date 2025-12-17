import React, { useState } from "react";
import { Link } from "react-router";
import { FcCommandLine } from "react-icons/fc";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(true);

  const avatar_url ="https://images.unsplash.com/photo-1765506265670-9e1c53f3a0e8?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* left and right */}
        <div className="flex justify-between h-16">
          {/* left  */}
          <div className="flex">
            {/* logo */}
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-2xl text-orange-600 font-bold">
                Blogify
              </Link>
            </div>

            {/* nav */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-6">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-orange-500 text-sm font-medium text-gray-900"
              >
                Home
              </Link>

              <Link
                to="/articles"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900"
              >
                Articles
              </Link>

              <Link
                to="/write"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900"
              >
                write
              </Link>

              <Link
                to="/myarticle"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900"
              >
                My Article
              </Link>
            </nav>
          </div>
          {/* Right */}

          <div className="flex items-center space-x-4">
            {/* Profile */}
            {isLoggedIn ? (
              <>
                <div className="text-gray-500 text-sm">
                  <span>hello, ShehabEldin</span>
                </div>
                <div className="relative">
                  <button className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 focus:outline-0 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500" 
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {
                      avatar_url ? <img className="w-8 h-8 rounded-full " src={avatar_url}/> : <FaUser className="text-orange-600" />
                    }
                  </button>

                 {/* Dropdown menu */}
                {
                  isDropdownOpen && (
                  <div 
                  className="absolute right-0 w-48 mt-1 rounded-md shadow-lg bg-white z-10"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="absolute h-8 w-full"></div>
                      <Link className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 ">Your Profile</Link> 
                      <Link className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100"> Manage Article</Link>
                      <Link className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100">Signout</Link>
                  </div>
                 )}
                </div>
              </>

            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md text-orange-600 bg-white border-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
