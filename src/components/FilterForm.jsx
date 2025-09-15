  import React, { useEffect, useState, useRef } from "react";
  import { Search,Filter, RefreshCcw , X } from "lucide-react";
  import AutocompleteSearch from "./SearchBar";
  import SearchableSelect from "../utils/SearchableSelect";
  import toast from "react-hot-toast";
  import calculateRanges from "../utils/calculateRange";
  import RangeFilter from "./RangeFilter";

  // Utility function to normalize strings
  const normalizeString = (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .toLowerCase()
      .replace(/[-_,]/g, "") // Remove hyphens, underscores, commas
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  };

  const getInputStyle = () => {
      // This is a placeholder function, assuming it was defined in the original component
      return "w-full p-2 border border-gray-300 rounded-md";
    };

  const FilterBar = ({
    filteredData,
    setFilteredData,
    refresh,
    setRefresh,
    fullPriceRange,
    fullAreaRange,
  }) => {
    const savedFilteredData = useRef(null);
    const hasRun = useRef(false);
    const dataInitialized = useRef(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [locationsArray, setLocationsArray] = useState([]);
    const [bedArray, setBedArray] = useState(["", 0, 1, 2, 3, 4, 5]);
    const [bathArray, setBathArray] = useState(["", 0, 1, 2, 3, 4, 5]);
    const [unitTypeArray, setUnitTypeArray] = useState([
      "",
      "Apartment",
      "Villa",
      "Short Term / Hotel Apartment",
    ]);
    const [statusArray, setStatusArray] = useState(["", "Published", "Pocketed"]);
    const [offeringArray, setOfferingArray] = useState(["", "Rent", "Sale"]);
    const [projectStatusArray, setProjectStatusArray] = useState([
      "",
      "Off Plan",
      "Off-Plan Primary",
      "Off-Plan Secondary",
      "Ready Primary",
      "Ready Secondary",
      "Completed",
    ]);
    const [ownerArray, setOwnerArray] = useState([""]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [areaRange, setAreaRange] = useState([0, 0]);
    const [fromArea, setFromArea] = useState(0);
    const [fromPrice, setFromPrice] = useState(0);
    const [toArea, setToArea] = useState(0);
    const [toPrice, setToPrice] = useState(0);

    useEffect(() => {
      if (hasRun.current || !filteredData || filteredData.length === 0) return;

      savedFilteredData.current = filteredData;
      hasRun.current = true;

      // Process locations
      const locationMap = new Map();

      const processLocation = (loc) => {
        if (!loc || typeof loc !== "string") return;

        const trimmed = loc.trim();
        if (!trimmed) return;

        // Split by multiple separators
        const parts = trimmed
          .split(/[-,]+|\s{2,}/)
          .map((p) => p.trim())
          .filter((p) => p);

        // Add individual parts and their combinations
        parts.forEach((part, index) => {
          const normalizedPart = normalizeString(part);
          if (normalizedPart && !locationMap.has(normalizedPart)) {
            locationMap.set(normalizedPart, part); // Store original casing
          }

          // Add combinations of parts (e.g., "Ubora Tower", "U-Bora Tower 1")
          for (let i = index + 1; i <= parts.length; i++) {
            const combined = parts.slice(index, i).join(" ");
            const normalizedCombined = normalizeString(combined);
            if (normalizedCombined && !locationMap.has(normalizedCombined)) {
              locationMap.set(normalizedCombined, combined);
            }
          }
        });

        // Add full location
        const normalizedFullKey = normalizeString(trimmed);
        if (normalizedFullKey && !locationMap.has(normalizedFullKey)) {
          locationMap.set(normalizedFullKey, trimmed);
        }
      };

      savedFilteredData.current.forEach((item) => {
        const { locationPf, locationBayut } = item || {};
        [locationPf, locationBayut].forEach(processLocation);
      });

      setLocationsArray([...locationMap.values()]);

      // Set filter arrays (unchanged)
      setBedArray(
        [
          "",
          ...new Set(
            savedFilteredData.current
              .map((item) => item?.bedrooms)
              .filter((b) => b !== undefined && b !== null)
          ),
        ].sort((a, b) => a - b)
      );

      setBathArray(
        [
          "",
          ...new Set(
            savedFilteredData.current
              .map((item) => item?.bathrooms)
              .filter((b) => b !== undefined && b !== null)
          ),
        ].sort((a, b) => a - b)
      );

      setOwnerArray([
        "",
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.ownerName)
            .filter((o) => o && typeof o === "string")
        ),
      ]);

      setUnitTypeArray([
        "",
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.unitType)
            .filter((u) => u && typeof u === "string")
        ),
      ]);

      setStatusArray([
        "",
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.status)
            .filter((s) => s && typeof s === "string")
        ),
      ]);

      setOfferingArray([
        "",
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.offeringType)
            .filter((o) => o && typeof o === "string")
        ),
      ]);

      dataInitialized.current = true;
    }, [filteredData]);

    useEffect(() => {
      if (dataInitialized.current && savedFilteredData.current?.length > 0) {
        const { priceRange: newPriceRange, areaRange: newAreaRange } =
          calculateRanges("saved filtered", savedFilteredData.current);

        setPriceRange(newPriceRange);
        setAreaRange(newAreaRange);
        setToPrice(newPriceRange[1]);
        setToArea(newAreaRange[1]);
        setFromPrice(newPriceRange[0]);
        setFromArea(newAreaRange[0]);
      }
    }, [dataInitialized.current]);

    const [filters, setFilters] = useState({
      ownerName: "",
      bedrooms: "",
      bathrooms: "",
      unitType: "",
      status: "",
      offeringType: "",
      projectStatus: "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFilters({ ...filters, [name]: value });
    };

    const handleFilterClick = () => {
      if (!savedFilteredData.current) return;

      const normalizedSearchTerm = normalizeString(searchTerm);

      const newFilteredData = savedFilteredData.current.filter((item) => {
        // Location match logic
        const locationMatch =
          !normalizedSearchTerm ||
          [item?.locationPf, item?.locationBayut].some((loc) => {
            if (!loc || typeof loc !== "string") return false;
            const normalizedLoc = normalizeString(loc);
            const locParts = normalizedLoc.split(" ");
            return (
              normalizedLoc.includes(normalizedSearchTerm) ||
              locParts.some((part) => part.includes(normalizedSearchTerm))
            );
          });

        const filterMatch = Object.entries(filters).every(([key, value]) => {
          if (value !== "" && value !== null) {
            const itemValue = item?.[key];
            if (itemValue === undefined || itemValue === null) return false;
            return itemValue
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase());
          }
          return true;
        });

        const itemPrice = parseFloat(String(item?.price).replace(/,/g, ""));
        const priceMatch =
          (fromPrice === "" || isNaN(fromPrice) || itemPrice >= fromPrice) &&
          (toPrice === "" || isNaN(toPrice) || itemPrice <= toPrice);

        const itemArea = parseFloat(item?.size);
        const areaMatch =
          (fromArea === "" || isNaN(fromArea) || itemArea >= fromArea) &&
          (toArea === "" || isNaN(toArea) || itemArea <= toArea);

        return locationMatch && filterMatch && priceMatch && areaMatch;
      });

      setFilteredData(newFilteredData);
    };

    const handleReset = () => {
      setFilters({
        ownerName: "",
        bedrooms: "",
        bathrooms: "",
        unitType: "",
        status: "",
        offeringType: "",
        projectStatus: "",
      });
      setSearchTerm("");
      setFromPrice(fullPriceRange[0]);
      setToPrice(fullPriceRange[1]);
      setFromArea(fullAreaRange[0]);
      setToArea(fullAreaRange[1]);

      if (savedFilteredData.current) {
        setFilteredData(savedFilteredData.current);
      }
    };

    const handleRefresh = () => {
      setRefresh((prev) => prev + 1);
      setIsSpinning(true);
      setFilters({
        ownerName: "",
        bedrooms: "",
        bathrooms: "",
        unitType: "",
        status: "",
        offeringType: "",
        projectStatus: "",
      });
      setSearchTerm("");
      toast.success("Refreshed successfully!");
      setTimeout(() => setIsSpinning(false), 1000);
    };

    const getInputStyle = (filterName) => {
      const isApplied = filters[filterName] !== "";
      return isApplied
        ? "w-full h-11 border border-blue-500 bg-blue-100 rounded-md p-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        : "w-full h-11 border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
    };
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };


    const selectFilters = [
      { name: "bedrooms", label: "Bed", options: bedArray },
      { name: "bathrooms", label: "Bath", options: bathArray },
      { name: "unitType", label: "Unit Type", options: unitTypeArray },
      { name: "status", label: "Status", options: statusArray },
      { name: "offeringType", label: "Offering Type", options: offeringArray },
      {
        name: "projectStatus",
        label: "Project Status",
        options: projectStatusArray,
      },
    ];

  return (
      <div className="relative w-full px-4 py-2 space-y-4">
        {/* Search Bar and Buttons */}
        <div className="relative w-full max-w-5xl mx-auto my-6 z-20">
          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <AutocompleteSearch
                locations={locationsArray}
                savedProperty={savedFilteredData.current}
                setProperty={setFilteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            {/* Search and Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFilterClick}

                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-emerald-800 transition-colors"
              >
                <Search size={20} className="inline-block mr-2" />
                Search
              </button>
              <button
                onClick={toggleFilters}
                className="px-6 py-3 bg-red-200 text-gray-700 rounded-lg font-semibold shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <Filter size={20} className="inline-block mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
        
       {/* Filter Dropdown - Naya aur Behtar Layout */}
      {showFilters && (
        <div className="relative w-full max-w-5xl mx-auto z-10 -mt-2">
          <div className="bg-white rounded-b-xl shadow-lg border border-gray-200 p-5 pt-8">
            <div className="space-y-5">

              {/* Section 1: Area & Price */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Primary Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <RangeFilter label="Area" unit="sqft." fromValue={fromArea} setFromValue={setFromArea} toValue={toArea} setToValue={setToArea} fullRange={fullAreaRange || [0, 10000]} />
                  <RangeFilter label="Price" unit="AED" fromValue={fromPrice} setFromValue={setFromPrice} toValue={toPrice} setToValue={setToPrice} fullRange={fullPriceRange || [0, 5000000]} />
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-600"></div>
              
                
              {/* Section 2: Other Details (New & Improved UI) */}
<div>
  <h3 className="text-md font-semibold text-gray-800 mb-3"></h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    
    {/* Listing Owner (Takes more space on larger screens) */}
    <div className="col-span-2 md:col-span-3 lg:col-span-1">
      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
        Listing Owner
      </label>
      <SearchableSelect
        id="ownerName"
        name="ownerName"
        value={filters.ownerName}
        onChange={handleInputChange}
        placeholder="Select Owner"
        options={ownerArray.filter(Boolean)}
      />
    </div>

    {/* All Other Select Filters */}
    {selectFilters.map((filter) => (
      <div key={filter.name}>
        <label htmlFor={filter.name} className="block text-sm font-medium text-gray-700 mb-1">
          {filter.label}
        </label>
        <div className="relative">
          <select
            id={filter.name}
            name={filter.name}
            value={filters[filter.name]}
            onChange={handleInputChange}
            className="w-full h-11 pl-3 pr-8 border border-gray-300 rounded-md text-sm bg-gray-50 appearance-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
          >
            <option value="">Any</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {filter.name === "bedrooms" && option === 0 ? "Studio" : option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
            </svg>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="bg-green-500 h-11 w-11 hover:bg-green-600 text-white font-semibold rounded-md flex items-center justify-center"
                  >
                    <RefreshCcw
                      className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`}
                      style={{ animationDuration: isSpinning ? "1s" : "0s" }}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleFilterClick}
                    className="bg-green-600 h-11 hover:bg-emerald-800 text-white font-semibold py-2 px-5 text-sm rounded-md"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-emerald-700 h-11 hover:bg-red-700 text-white font-semibold py-2 px-5 text-sm rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  };

  export default FilterBar;