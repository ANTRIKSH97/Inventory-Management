import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="logo.svg"
                alt="Imza Inventory Logo"
                className="bg-green-950 p-2 h-16 object-contain rounded-md shadow-sm"
              />
            </a>
          </div>

          {/* Middle: Title (Aapke original design jaisa) */}
          <div className="flex flex-col items-center">
            <h1 className="text-xl md:text-3xl font-semibold text-blue-800 tracking-tight">
              <span className="text-[#104737]">Imza Inventory Management</span>
            </h1>
            <div className="mt-3">
              <div className="w-60 h-1 bg-gradient-to-r from-green-300 to-[#0C372A] rounded-full"></div>
            </div>
          </div>

          {/* Right Side: Empty div for balance taki title center mein rahe */}
          <div className="w-28 hidden md:block"></div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;