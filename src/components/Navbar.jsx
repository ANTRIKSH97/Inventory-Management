import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Flex container with proper spacing */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Side: Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={scrollToTop}
            >
              <div
                className="w-10 h-12 md:w-14 md:h-16 rounded-lg overflow-hidden shadow-md
                           bg-gradient-to-tr from-green-700 to-green-700
                           flex items-center justify-center"
              >
                <img
                  src="/logo.png"
                  alt="Smart Inventory Logo"
                  className="w-8 h-8 md:w-12 md:h-12 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Middle: Title */}
          <div className="flex-shrink-0 px-2 text-center">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex flex-col items-center"
            >
              {/* Responsive text size for the title */}
              <h1
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold 
                           bg-gradient-to-r from-green-700 to-green-500
                           bg-clip-text text-transparent leading-tight"
              >
                Inventory Management
              </h1>

              {/* Gradient line */}
              <div className="mt-1 sm:mt-2 hidden sm:block">
                <div className="w-32 sm:w-40 md:w-56 lg:w-64 h-1 bg-gradient-to-r from-green-300 to-green-600 rounded-full"></div>
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
