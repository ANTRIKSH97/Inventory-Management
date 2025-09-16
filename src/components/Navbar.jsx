import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">

          {/* Left Side: Logo + Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              {/* Colorful Logo */}
              <div className="w-14 h-16 rounded-lg overflow-hidden shadow-lg
                              bg-gradient-to-tr from-green-700 via-green-700 to-green-700
                              flex items-center justify-center">
                <img 
                  src="/logo.png"  // public folder me logo directly access
                  alt="Smart Inventory Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-wide hidden sm:block">
                
              </span>
            </Link>
          </div>

          {/* Middle: Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold
                           bg-gradient-to-r from-green-700 via-green-700 to-green-700
                           bg-clip-text text-transparent whitespace-nowrap">
               Inventory Management
            </h1>
            <div className="mt-2">
              <div className="w-64 h-1 bg-gradient-to-r from-green-300 to-green-600 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
