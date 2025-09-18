import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    // Replaced shadow with a clean bottom border for a more modern look
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using the same robust 3-column layout */}
        <div className="flex items-center justify-between h-20">

          {/* Left Side: Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center space-x-3" onClick={scrollToTop}>
              {/* Simplified logo background for better contrast and a square aspect ratio */}
              <div className="w-14 h-14 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                <img 
                  src="/logo.png"
                  alt="Inventory Management Logo" 
                  className="w-11 h-11 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Middle: Title (with refined styling) */}
          <div className="flex-shrink-0 px-2">
            <Link to="/" onClick={scrollToTop} className="flex flex-col items-center">
              {/* Solid text color is more readable and professional than a gradient */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center leading-tight">
                Inventory Management
              </h1>
              {/* The gradient line is now more subtle */}
              <div className="mt-1.5 hidden sm:block">
                <div className="w-48 md:w-64 h-1 bg-gradient-to-r from-green-200 to-gray-400 rounded-full"></div>
              </div>
            </Link>
          </div>

          {/* Right Side: Empty div for balancing the layout */}
          <div className="flex-1"></div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

