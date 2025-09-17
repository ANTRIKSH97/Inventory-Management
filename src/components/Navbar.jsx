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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* A robust 3-column layout using flexbox */}
        <div className="flex items-center justify-between h-20">

          {/* Left Side: Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center space-x-3" onClick={scrollToTop}>
              <div className="w-12 h-14 md:w-14 md:h-16 rounded-lg overflow-hidden shadow-lg
                                bg-gradient-to-tr from-green-700 to-green-700
                                flex items-center justify-center">
                <img 
                  src="/logo.png"
                  alt="Smart Inventory Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Middle: Title (Now visible on all screen sizes) */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={scrollToTop} className="flex flex-col items-center">
              {/* Responsive text size for the title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold
                               bg-gradient-to-r from-green-700 to-green-700
                               bg-clip-text text-transparent whitespace-nowrap">
                Inventory Management
              </h1>
              {/* Gradient line is hidden on the smallest screens for a cleaner look */}
              <div className="mt-2 hidden sm:block">
                <div className="w-48 md:w-64 h-1 bg-gradient-to-r from-green-300 to-green-600 rounded-full"></div>
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

