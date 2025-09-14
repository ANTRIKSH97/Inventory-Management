import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const handleClear = (e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onChange({ target: { name, value: '' } });
  };
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`w-[400%] lg:w-[100%] md:w-[110%] sm:w-[300%] h-11 border flex items-center justify-between px-2 ${
          value ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
        } rounded-md text-sm text-gray-700 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <div className="flex items-center px-1">
          {value && (
            <button 
              onClick={handleClear}
              className="mr-2 p-1 hover:cursor-pointer border border-red-300 bg-red-100 rounded-full"
            >
              ✘ 
            </button>
          )}
      </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-[400%] lg:w-[100%] md:w-[110%] sm:w-[300%] bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b flex items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full outline-none text-sm"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  onClick={() => {
                    onChange({ target: { name, value: option } });
                    setIsOpen(false);
                    setSearchText('');
                  }}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;