import React, { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";

// Normalize strings: remove hyphens, underscores, commas, and normalize spaces
const normalizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/[-_,]/g, "") // Remove hyphens, underscores, commas
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
};

const AutocompleteSearch = ({
  locations,
  savedProperty,
  setProperty,
  searchTerm,
  setSearchTerm,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      if (savedProperty) {
        setProperty(savedProperty); // Reset to all properties
      }
      return;
    }

    const normalizedTerm = normalizeString(searchTerm);
    const filteredLocations = (Array.isArray(locations) ? locations : [])
      .filter((location) => {
        const normalizedLocation = normalizeString(location);
        const locationParts = normalizedLocation.split(" ");
        return (
          normalizedLocation.includes(normalizedTerm) ||
          locationParts.some((part) => part.includes(normalizedTerm))
        );
      })
      .sort((a, b) => {
        const normalizedA = normalizeString(a);
        const normalizedB = normalizeString(b);
        const aStarts = normalizedA.startsWith(normalizedTerm);
        const bStarts = normalizedB.startsWith(normalizedTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        // Prioritize shorter matches
        if (normalizedA.length !== normalizedB.length) {
          return normalizedA.length - normalizedB.length;
        }
        return a.localeCompare(b);
      })
      .slice(0, 10);

    setSuggestions(filteredLocations);

    // Real-time filtering as user types
    if (savedProperty) {
      const filtered = savedProperty.filter((item) => {
        const normalizedLocationPf = normalizeString(item?.locationPf || "");
        const normalizedLocationBayut = normalizeString(item?.locationBayut || "");
        const pfParts = normalizedLocationPf.split(" ");
        const bayutParts = normalizedLocationBayut.split(" ");
        return (
          normalizedLocationPf.includes(normalizedTerm) ||
          normalizedLocationBayut.includes(normalizedTerm) ||
          pfParts.some((part) => part.includes(normalizedTerm)) ||
          bayutParts.some((part) => part.includes(normalizedTerm))
        );
      });
      setProperty(filtered);
    }
  }, [searchTerm, locations, savedProperty, setProperty]);

  const handleLocationSelect = (location) => {
    setSearchTerm(location);
    setShowSuggestions(false);
    // Filter properties based on selected location
    if (savedProperty) {
      const normalizedLocation = normalizeString(location);
      const filtered = savedProperty.filter((item) => {
        const normalizedLocationPf = normalizeString(item?.locationPf || "");
        const normalizedLocationBayut = normalizeString(item?.locationBayut || "");
        const pfParts = normalizedLocationPf.split(" ");
        const bayutParts = normalizedLocationBayut.split(" ");
        return (
          normalizedLocationPf.includes(normalizedLocation) ||
          normalizedLocationBayut.includes(normalizedLocation) ||
          pfParts.some((part) => part.includes(normalizedLocation)) ||
          bayutParts.some((part) => part.includes(normalizedLocation))
        );
      });
      setProperty(filtered);
    }
  };

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (savedProperty) {
      setProperty(savedProperty); // Reset to all properties
    }
  };

  return (
    <div className="relative w-full mx-auto my-2">
      <div className="flex items-center relative">
        <input
          type="text"
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Search for a city, community, or building..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
          {suggestions.map((location, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors flex items-center"
              onMouseDown={() => handleLocationSelect(location)}
            >
              <div className="w-6 flex-shrink-0 flex justify-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <span className="ml-2">{location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;