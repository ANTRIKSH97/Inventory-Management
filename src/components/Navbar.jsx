import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Step 1: Parent div ko 'relative' banaya */}
        <div className="relative flex items-center justify-start h-20">
          
          {/* Left Side: Logo (Yeh ab hamesha corner mein rahega) */}
          <div className="flex-shrink-0 ml-0">
            <a href="/" className="flex items-center">
              <img
                src="logo.svg"
                alt="Imza Inventory Logo"
                className="bg-green-950 p-2 h-16 object-contain rounded-md shadow-sm"
              />
            </a>
          </div>

          {/* Middle: Title (Isko absolutely center kar diya gaya hai) */}
          {/* Step 2: Title ko absolute positioning di gayi */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h1 className="text-xl md:text-3xl font-semibold text-gray-800 tracking-tight">
              <span className="text-[#104737]">Imza Inventory Management</span>
            </h1>
            <div className="mt-2">
              <div className="w-60 h-1 bg-gradient-to-r from-green-300 to-[#0C372A] rounded-full"></div>
            </div>
          </div>
          
          {/* Right side se empty div hata diya gaya hai */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
3